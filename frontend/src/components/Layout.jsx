import React from 'react'
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Stepper, Step, StepLabel, Snackbar } from '@mui/material'
import NavBar from './NavBar/NavBar'

const steps = ['Upload Receipt', 'Review & Edit', 'Save']

function Layout({ children, activeStep, snackbarOpen, snackbarMsg, onSnackbarClose }) {
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4, minHeight: 300 }}>
          {children}
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={onSnackbarClose}
        message={snackbarMsg}
      />
    </ThemeProvider>
  )
}

export default Layout 