import React, { useState } from 'react'
import Layout from './components/Layout'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Upload from './components/Upload/Upload'
import ReceiptTable from './components/ReceiptTable'

function App() {
  const [activeStep, setActiveStep] = useState(0)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [receiptData, setReceiptData] = useState(null)

  // Placeholder step content
  const stepContent = [
    <Upload key="upload" onUploadSuccess={setReceiptData} onNext={() => setActiveStep(1)} />,
    <ReceiptTable key="review" data={receiptData} onNext={() => setActiveStep(2)} />,
    <div key="save">Save Step Content Placeholder</div>
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
