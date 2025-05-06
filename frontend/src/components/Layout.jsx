import React from 'react'
import { Container, Box, Stepper, Step, StepLabel, Snackbar } from '@mui/material'
import NavBar from './NavBar/NavBar'

const steps = ['Upload Receipt', 'Review & Edit', 'Save']

function Layout({ children, activeStep, snackbarOpen, snackbarMsg, onSnackbarClose }) {
  return (
    <>
      <NavBar />
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ mb: 4, width: '100%' }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ minHeight: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {children}
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={onSnackbarClose}
        message={snackbarMsg}
      />
    </>
  )
}

export default Layout 