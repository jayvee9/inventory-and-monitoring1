import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
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

const OfficeSupplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    location: '',
    status: '',
    accountablePerson: '',
    user: '',
    pcName: '',
  });

  // ... existing fetchSupplies and handleSubmit functions ...

  const handleRowClick = (supply) => {
    setSelectedSupply(supply);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedSupply) => {
    try {
      const { error } = await supabase
        .from('office_supplies')
        .update({
          accountable_person: updatedSupply.accountablePerson,
          user: updatedSupply.user,
          pc_name: updatedSupply.pcName,
        })
        .eq('id', updatedSupply.id);

      if (error) throw error;

      // Update local state
      setSupplies(supplies.map(supply => 
        supply.id === updatedSupply.id 
          ? { ...supply, ...updatedSupply }
          : supply
      ));
    } catch (error) {
      console.error('Error updating supply:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Office Supplies
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New Supply
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Accountable Person</TableCell>
              <TableCell>User</TableCell>
              <TableCell>PC Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supplies.map((supply) => (
              <TableRow 
                key={supply.id}
                onClick={() => handleRowClick(supply)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
              >
                <TableCell>{supply.item_name}</TableCell>
                <TableCell>{supply.quantity}</TableCell>
                <TableCell>{supply.location}</TableCell>
                <TableCell>{supply.status}</TableCell>
                <TableCell>{supply.accountable_person}</TableCell>
                <TableCell>{supply.user}</TableCell>
                <TableCell>{supply.pc_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Supply Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Supply</DialogTitle>
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
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
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
            Add Supply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedSupply}
        onSave={handleEditSave}
        type="Office Supply"
      />
    </Container>
  );
};

export default OfficeSupplies; 