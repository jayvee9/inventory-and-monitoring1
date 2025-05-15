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

const Computers = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [formData, setFormData] = useState({
    pcName: '',
    serialNumber: '',
    model: '',
    location: '',
    status: '',
    accountablePerson: '',
    user: '',
  });

  // ... existing fetchComputers and handleSubmit functions ...

  const handleRowClick = (computer) => {
    setSelectedComputer(computer);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedComputer) => {
    try {
      const { error } = await supabase
        .from('computers')
        .update({
          accountable_person: updatedComputer.accountablePerson,
          user: updatedComputer.user,
          pc_name: updatedComputer.pcName,
        })
        .eq('id', updatedComputer.id);

      if (error) throw error;

      // Update local state
      setComputers(computers.map(computer => 
        computer.id === updatedComputer.id 
          ? { ...computer, ...updatedComputer }
          : computer
      ));
    } catch (error) {
      console.error('Error updating computer:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Computers
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New Computer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PC Name</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Accountable Person</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {computers.map((computer) => (
              <TableRow 
                key={computer.id}
                onClick={() => handleRowClick(computer)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
              >
                <TableCell>{computer.pc_name}</TableCell>
                <TableCell>{computer.serial_number}</TableCell>
                <TableCell>{computer.model}</TableCell>
                <TableCell>{computer.location}</TableCell>
                <TableCell>{computer.status}</TableCell>
                <TableCell>{computer.accountable_person}</TableCell>
                <TableCell>{computer.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Computer Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Computer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PC Name"
                name="pcName"
                value={formData.pcName}
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Computer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedComputer}
        onSave={handleEditSave}
        type="Computer"
      />
    </Container>
  );
};

export default Computers; 