import React, { useState, useEffect } from 'react';
import { fetchReceiptSummaries } from '../services/api';

function ReceiptSummaryList() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReceiptSummaries()
      .then(setSummaries)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading receipt summaries...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!summaries.length) return <div>No receipts found.</div>;

  return (
    <div>
      <h2>All Receipts</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
            <tr key={r.id}>
              <td style={{ padding: '8px' }}>{r.filename}</td>
              <td style={{ padding: '8px' }}>{r.vendor}</td>
              <td style={{ padding: '8px' }}>{r.total}</td>
              <td style={{ padding: '8px' }}>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReceiptSummaryList; 