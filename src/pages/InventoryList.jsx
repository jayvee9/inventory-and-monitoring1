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
  Alert,
} from '@mui/material';
import EditProfileModal from '../components/EditProfileModal';

const InventoryList = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    fetchComputers();
  }, []);

  const fetchComputers = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('computers')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setComputers(data || []);
    } catch (error) {
      console.error('Error fetching computers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const { error } = await supabase
        .from('computers')
        .insert([{
          pc_name: formData.pcName,
          serial_number: formData.serialNumber,
          model: formData.model,
          location: formData.location,
          status: formData.status,
          accountable_person: formData.accountablePerson,
          user: formData.user,
        }]);

      if (error) throw error;

      // Reset form and close dialog
      setFormData({
        pcName: '',
        serialNumber: '',
        model: '',
        location: '',
        status: '',
        accountablePerson: '',
        user: '',
      });
      setOpen(false);
      
      // Refresh the list
      fetchComputers();
    } catch (error) {
      console.error('Error adding computer:', error);
      setError(error.message);
    }
  };

  const handleRowClick = (computer) => {
    console.log('Row clicked:', computer);
    setSelectedComputer(computer);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedComputer) => {
    try {
      setError(null);
      console.log('Saving updated computer:', updatedComputer);
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
      setError(error.message);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Computers Inventory
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
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
                sx={{ 
                  cursor: 'pointer', 
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                  '&:active': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
                }}
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
        onClose={() => {
          setEditModalOpen(false);
          setSelectedComputer(null);
        }}
        item={selectedComputer}
        onSave={handleEditSave}
        type="Computer"
      />
    </Container>
  );
};

export default InventoryList; 