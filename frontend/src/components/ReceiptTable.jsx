import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField, Snackbar, Alert } from '@mui/material';
import { uploadReceipt, fetchReceipts, saveReceipt } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ReceiptTable({ data, onNext }) {
  const [pages, setPages] = useState(() => JSON.parse(JSON.stringify(data)));
  const [edited, setEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    return <Typography variant="body1">No receipt data to display.</Typography>;
  }

  const handleItemChange = (pageIdx, itemIdx, field, value) => {
    setPages(prev => {
      const updated = [...prev];
      if (!updated[pageIdx].data) return updated;
      updated[pageIdx] = { ...updated[pageIdx], data: { ...updated[pageIdx].data } };
      updated[pageIdx].data.items = [...updated[pageIdx].data.items];
      updated[pageIdx].data.items[itemIdx] = { ...updated[pageIdx].data.items[itemIdx], [field]: value };
      return updated;
    });
    setEdited(true);
  };

  const handleFieldChange = (pageIdx, field, value) => {
    setPages(prev => {
      const updated = [...prev];
      if (!updated[pageIdx].data) return updated;
      updated[pageIdx] = { ...updated[pageIdx], data: { ...updated[pageIdx].data, [field]: value } };
      return updated;
    });
    setEdited(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveReceipt(pages);
      setNotification({
        open: true,
        message: 'Successfully saved to database!',
        severity: 'success'
      });
      setEdited(false);
      if (onNext) onNext(pages);
      navigate('/receipts');
    } catch (error) {
      setNotification({
        open: true,
        message: `Error saving to database: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>Review & Edit Receipt Data</Typography>
      {pages.map((page, idx) => (
        <Box key={idx} mb={4}>
          <Typography variant="subtitle1" gutterBottom>Page {page.page}</Typography>
          {page.error ? (
            <Typography color="error">{page.error}</Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Qty</TableCell>
                      <TableCell>Item Number</TableCell>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(page.data.items || []).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <TextField
                            value={item.Qty || item.qty || ''}
                            onChange={e => handleItemChange(idx, i, 'Qty', e.target.value)}
                            variant="standard"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={item.Item_Number || item.item_number || ''}
                            onChange={e => handleItemChange(idx, i, 'Item_Number', e.target.value)}
                            variant="standard"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={item.Item_Name || item.item_name || ''}
                            onChange={e => handleItemChange(idx, i, 'Item_Name', e.target.value)}
                            variant="standard"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={item.Amount || item.amount || ''}
                            onChange={e => handleItemChange(idx, i, 'Amount', e.target.value)}
                            variant="standard"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div style={{ marginTop: 16 }}>
                <TextField
                  label="Vendor"
                  value={page.data.Vendor || page.data.vendor || ''}
                  onChange={e => handleFieldChange(idx, 'Vendor', e.target.value)}
                  variant="standard"
                  sx={{ mr: 2, minWidth: 180 }}
                />
                <TextField
                  label="Date"
                  value={page.data.Date || page.data.date || ''}
                  onChange={e => handleFieldChange(idx, 'Date', e.target.value)}
                  variant="standard"
                  sx={{ mr: 2, minWidth: 180 }}
                />
                <TextField
                  label="Subtotal"
                  value={page.data.Subtotal || page.data.subtotal || ''}
                  onChange={e => handleFieldChange(idx, 'Subtotal', e.target.value)}
                  variant="standard"
                  sx={{ mr: 2, minWidth: 120 }}
                />
                <TextField
                  label="Tax"
                  value={page.data.Tax || page.data.tax || ''}
                  onChange={e => handleFieldChange(idx, 'Tax', e.target.value)}
                  variant="standard"
                  sx={{ mr: 2, minWidth: 120 }}
                />
                <TextField
                  label="Total"
                  value={page.data.Total || page.data.total || ''}
                  onChange={e => handleFieldChange(idx, 'Total', e.target.value)}
                  variant="standard"
                  sx={{ minWidth: 120 }}
                />
              </div>
            </>
          )}
        </Box>
      ))}
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 24, marginRight: 16 }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save & Apply'}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        style={{ marginTop: 24 }}
        onClick={() => setPages(JSON.parse(JSON.stringify(data)))}
        disabled={!edited || loading}
      >
        Cancel
      </Button>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
} 