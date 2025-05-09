import React from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <Typography variant="h3" gutterBottom>
        Welcome to ParseMate
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Choose an action below:
      </Typography>
      <Stack spacing={2} direction="column" mt={4}>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/receipts')}>
          See All Receipts
        </Button>
        <Button variant="outlined" color="primary" size="large" onClick={() => navigate('/upload')}>
          Upload a Receipt
        </Button>
      </Stack>
    </Box>
  );
};

export default Home; 