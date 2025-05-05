import React, { useState } from 'react'
import Layout from './components/Layout'

function App() {
  const [activeStep, setActiveStep] = useState(0)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')

  // Placeholder step content
  const stepContent = [
    <div key="upload">Upload Step Content Placeholder</div>,
    <div key="review">Review & Edit Step Content Placeholder</div>,
    <div key="save">Save Step Content Placeholder</div>
  ]

  return (
    <Layout
      activeStep={activeStep}
      snackbarOpen={snackbarOpen}
      snackbarMsg={snackbarMsg}
      onSnackbarClose={() => setSnackbarOpen(false)}
    >
      {stepContent[activeStep]}
    </Layout>
  )
}

export default App
