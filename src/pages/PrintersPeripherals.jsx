import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import EditProfileModal from '../components/EditProfileModal';

const PrintersPeripherals = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    serialNumber: '',
    model: '',
    location: '',
    status: '',
    accountablePerson: '',
    user: '',
    pcName: '',
  });

  // ... existing fetchItems and handleSubmit functions ...

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedItem) => {
    try {
      const { error } = await supabase
        .from('printers_peripherals')
        .update({
          accountable_person: updatedItem.accountablePerson,
          user: updatedItem.user,
          pc_name: updatedItem.pcName,
        })
        .eq('id', updatedItem.id);

      if (error) throw error;

      // Update local state
      setItems(items.map(item => 
        item.id === updatedItem.id 
          ? { ...item, ...updatedItem }
          : item
      ));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Printers and Peripherals
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Accountable Person</TableCell>
              <TableCell>User</TableCell>
              <TableCell>PC Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow 
                key={item.id}
                onClick={() => handleRowClick(item)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
              >
                <TableCell>{item.item_name}</TableCell>
                <TableCell>{item.serial_number}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.accountable_person}</TableCell>
                <TableCell>{item.user}</TableCell>
                <TableCell>{item.pc_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Item Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Serial Number"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Accountable Person"
                name="accountablePerson"
                value={formData.accountablePerson}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="User"
                name="user"
                value={formData.user}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PC Name"
                name="pcName"
                value={formData.pcName}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedItem}
        onSave={handleEditSave}
        type="Printer/Peripheral"
      />
    </Container>
  );
};

export default PrintersPeripherals; 