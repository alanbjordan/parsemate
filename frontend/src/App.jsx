import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Upload from './components/Upload/Upload'
import ReceiptTable from './components/ReceiptTable'
import ReceiptSummaryList from './components/ReceiptSummaryList'
import Home from './components/Home'

function AppRoutes() {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [receiptData, setReceiptData] = useState(null)
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={
        <Layout
          snackbarOpen={snackbarOpen}
          snackbarMsg={snackbarMsg}
          onSnackbarClose={() => setSnackbarOpen(false)}
          showStepper={false}
        >
          <Home />
        </Layout>
      } />
      <Route path="/upload" element={
        <Layout
          snackbarOpen={snackbarOpen}
          snackbarMsg={snackbarMsg}
          onSnackbarClose={() => setSnackbarOpen(false)}
          showStepper={true}
          activeStep={0}
        >
          <Upload onUploadSuccess={result => {
            if (result && Array.isArray(result.parsed_data)) {
              const pages = result.parsed_data.map(page => ({ ...page, file: result.file_path, filename: result.filename }));
              setReceiptData(pages);
              navigate('/review');
            } else {
              setReceiptData(null);
            }
          }} />
        </Layout>
      } />
      <Route path="/review" element={
        <Layout
          snackbarOpen={snackbarOpen}
          snackbarMsg={snackbarMsg}
          onSnackbarClose={() => setSnackbarOpen(false)}
          showStepper={true}
          activeStep={1}
        >
          <ReceiptTable data={receiptData} />
        </Layout>
      } />
      <Route path="/receipts" element={
        <Layout
          snackbarOpen={snackbarOpen}
          snackbarMsg={snackbarMsg}
          onSnackbarClose={() => setSnackbarOpen(false)}
          showStepper={false}
        >
          <ReceiptSummaryList />
        </Layout>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
