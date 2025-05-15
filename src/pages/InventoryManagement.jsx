import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box
} from '@mui/material';

const InventoryManagement = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Inventory Management
        </Typography>
        <Box>
          <Typography variant="body1">
            Inventory management content will be added here.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default InventoryManagement; 