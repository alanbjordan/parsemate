import React, { useState, useEffect } from 'react'
import Layout from './components/Layout'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Upload from './components/Upload/Upload'
import ReceiptTable from './components/ReceiptTable'
import ReceiptSummaryList from './components/ReceiptSummaryList'

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
