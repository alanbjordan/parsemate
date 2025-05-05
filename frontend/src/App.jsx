import React, { useState } from 'react'
import Layout from './components/Layout'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Upload from './components/Upload/Upload'

function App() {
  const [activeStep, setActiveStep] = useState(0)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')

  // Placeholder step content
  const stepContent = [
    <Upload key="upload" />,
    <div key="review">Review & Edit Step Content Placeholder</div>,
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
