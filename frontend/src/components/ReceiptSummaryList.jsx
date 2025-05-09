import React, { useState, useEffect } from 'react';
import { fetchReceiptSummaries, fetchReceiptById } from '../services/api';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Table, TableBody, TableCell, TableRow, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function ReceiptDetailModal({ open, onClose, receiptId }) {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && receiptId) {
      setLoading(true);
      setError(null);
      fetchReceiptById(receiptId)
        .then(setReceipt)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setReceipt(null);
    }
  }, [open, receiptId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Receipt Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography> : receipt && (
          <div>
            <Typography variant="subtitle1" gutterBottom>Filename: {receipt.filename}</Typography>
            <Typography variant="subtitle2" gutterBottom>Vendor: {receipt.vendor}</Typography>
            <Typography variant="subtitle2" gutterBottom>Date: {receipt.date}</Typography>
            <Typography variant="subtitle2" gutterBottom>Total: {receipt.total}</Typography>
            <Typography variant="subtitle2" gutterBottom>Tax: {receipt.tax}</Typography>
            <Typography variant="subtitle2" gutterBottom>Subtotal: {receipt.subtotal}</Typography>
            <Typography variant="subtitle2" gutterBottom>File: <a href={receipt.file_path} target="_blank" rel="noopener noreferrer">View/Download File</a></Typography>
            <Typography variant="subtitle2" gutterBottom>Upload Time: {receipt.upload_time}</Typography>
            <Typography variant="h6" gutterBottom>Items</Typography>
            <Table size="small">
              <TableBody>
                {receipt.items && receipt.items.length > 0 ? receipt.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>Qty: {item.Qty || item.qty}</TableCell>
                    <TableCell>Item Number: {item.Item_Number || item.item_number}</TableCell>
                    <TableCell>Item Name: {item.Item_Name || item.item_name}</TableCell>
                    <TableCell>Amount: {item.Amount || item.amount}</TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={4}>No items</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReceiptSummaryList() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchReceiptSummaries()
      .then(setSummaries)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRowClick = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  if (loading) return <div>Loading receipt summaries...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!summaries.length) return <div>No receipts found.</div>;

  return (
    <div>
      <h2>All Receipts</h2>
      <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>Filename</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Vendor</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Total</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map(r => (
            <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => handleRowClick(r.id)}>
              <td style={{ padding: '8px' }}>{r.filename}</td>
              <td style={{ padding: '8px' }}>{r.vendor}</td>
              <td style={{ padding: '8px' }}>{r.total}</td>
              <td style={{ padding: '8px' }}>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ReceiptDetailModal open={modalOpen} onClose={handleCloseModal} receiptId={selectedId} />
    </div>
  );
}

export default ReceiptSummaryList; 