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
  Select,
  MenuItem,
} from '@mui/material';
import EditProfileModal from '../components/EditProfileModal';

const Laptops = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLaptop, setSelectedLaptop] = useState(null);
  const [formData, setFormData] = useState({
    laptopName: '',
    serialNumber: '',
    model: '',
    location: '',
    status: '',
    accountablePerson: '',
    user: '',
    pcName: '',
  });

  // ... existing fetchLaptops and handleSubmit functions ...

  const handleRowClick = (laptop) => {
    setSelectedLaptop(laptop);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedLaptop) => {
    try {
      const { error } = await supabase
        .from('laptops')
        .update({
          accountable_person: updatedLaptop.accountablePerson,
          user: updatedLaptop.user,
          pc_name: updatedLaptop.pcName,
        })
        .eq('id', updatedLaptop.id);

      if (error) throw error;

      // Update local state
      setLaptops(laptops.map(laptop => 
        laptop.id === updatedLaptop.id 
          ? { ...laptop, ...updatedLaptop }
          : laptop
      ));
    } catch (error) {
      console.error('Error updating laptop:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Laptops
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New Laptop
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Laptop Name</TableCell>
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
            {laptops.map((laptop) => (
              <TableRow 
                key={laptop.id}
                onClick={() => handleRowClick(laptop)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
              >
                <TableCell>{laptop.laptop_name}</TableCell>
                <TableCell>{laptop.serial_number}</TableCell>
                <TableCell>{laptop.model}</TableCell>
                <TableCell>{laptop.location}</TableCell>
                <TableCell>{laptop.status}</TableCell>
                <TableCell>{laptop.accountable_person}</TableCell>
                <TableCell>{laptop.user}</TableCell>
                <TableCell>{laptop.pc_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Laptop Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Laptop</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Laptop Name"
                name="laptopName"
                value={formData.laptopName}
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
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select a location</option>
                <option value="ORD- Office of the Director">ORD- Office of the Director</option>
                <option value="FAD - Finance and Administrative Division">FAD - Finance and Administrative Division</option>
                <option value="LRD - Licensure and Registration Division">LRD - Licensure and Registration Division</option>
                <option value="Application Section">Application Section</option>
                <option value="Registration Section">Registration Section</option>
                <option value="Regulation Division">Regulation Division</option>
                <option value="Legal Section">Legal Section</option>
                <option value="Storage Room 2">Storage Room 2</option>
                <option value="Robinsons Iligan">Robinsons Iligan</option>
                <option value="Robinsons Valencia">Robinsons Valencia</option>
              </select>
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
            Add Laptop
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedLaptop}
        onSave={handleEditSave}
        type="Laptop"
      />
    </Container>
  );
};

export default Laptops; 