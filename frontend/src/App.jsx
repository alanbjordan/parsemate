import React, { useState, useEffect } from 'react'
import Layout from './components/Layout'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Upload from './components/Upload/Upload'
import ReceiptTable from './components/ReceiptTable'
import { fetchReceiptSummaries } from './services/api'

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

function App() {
  const [activeStep, setActiveStep] = useState(0)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [receiptData, setReceiptData] = useState(null)

  // Placeholder step content
  const stepContent = [
    <Upload key="upload" onUploadSuccess={result => {
      // result is the API response object
      // result.parsed_data is an array of page objects
      // Attach file info if needed
      if (result && Array.isArray(result.parsed_data)) {
        // Attach file info to each page if needed
        const pages = result.parsed_data.map(page => ({ ...page, file: result.file_path, filename: result.filename }));
        setReceiptData(pages);
      } else {
        setReceiptData(null);
      }
    }} onNext={() => setActiveStep(1)} />,
    <ReceiptTable key="review" data={receiptData} onNext={() => setActiveStep(2)} />,
    <ReceiptSummaryList key="summary" />
  ]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        activeStep={activeStep}
        snackbarOpen={snackbarOpen}
        snackbarMsg={snackbarMsg}
        onSnackbarClose={() => setSnackbarOpen(false)}
      >
        {stepContent[activeStep]}
      </Layout>
    </ThemeProvider>
  )
}

export default App
