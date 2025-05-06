import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';

export default function ReceiptTable({ data, onNext }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <Typography variant="body1">No receipt data to display.</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>Review & Edit Receipt Data</Typography>
      {data.map((page, idx) => (
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
                        <TableCell>{item.Qty || item.qty || ''}</TableCell>
                        <TableCell>{item.Item_Number || item.item_number || ''}</TableCell>
                        <TableCell>{item.Item_Name || item.item_name || ''}</TableCell>
                        <TableCell>{item.Amount || item.amount || ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div style={{ marginTop: 16 }}>
                <Typography variant="subtitle1">Vendor: {page.data.Vendor || page.data.vendor || ''}</Typography>
                <Typography variant="subtitle1">Date: {page.data.Date || page.data.date || ''}</Typography>
                <Typography variant="subtitle1">Subtotal: {page.data.Subtotal || page.data.subtotal || ''}</Typography>
                <Typography variant="subtitle1">Tax: {page.data.Tax || page.data.tax || ''}</Typography>
                <Typography variant="subtitle1">Total: {page.data.Total || page.data.total || ''}</Typography>
              </div>
            </>
          )}
        </Box>
      ))}
      <Button variant="contained" color="primary" style={{ marginTop: 24 }} onClick={onNext}>
        Next
      </Button>
    </div>
  );
} 