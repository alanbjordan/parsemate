import React, { useState, useEffect } from 'react';
import { fetchReceiptSummaries, fetchReceiptById, deleteReceiptById } from '../services/api';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Table, TableBody, TableCell, TableRow, CircularProgress, Breadcrumbs, Link, Box, Button, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

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
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteReceiptById(deleteId);
      setSummaries(summaries => summaries.filter(r => r.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setDeleteError(err.message);
    }
    setDeleteLoading(false);
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary">All Receipts</Typography>
      </Breadcrumbs>
      <h2>All Receipts</h2>
      {loading ? (
        <div>Loading receipt summaries...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : !summaries.length ? (
        <div>No receipts found.</div>
      ) : (
        <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px' }}>Filename</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Vendor</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Total</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map(r => (
              <tr key={r.id}>
                <td style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleRowClick(r.id)}>{r.filename}</td>
                <td style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleRowClick(r.id)}>{r.vendor}</td>
                <td style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleRowClick(r.id)}>{r.total}</td>
                <td style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleRowClick(r.id)}>{r.date}</td>
                <td style={{ padding: '8px' }}>
                  <IconButton color="error" onClick={() => setDeleteId(r.id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <ReceiptDetailModal open={modalOpen} onClose={handleCloseModal} receiptId={selectedId} />
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this receipt?</Typography>
          {deleteError && <Typography color="error">{deleteError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleteLoading}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReceiptSummaryList; 