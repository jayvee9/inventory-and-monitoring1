import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import InventoryList from '../components/InventoryList';
import { Container, Typography, Alert, CircularProgress } from '@mui/material';

const InventoryListPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error } = await supabase.from('computers').select('*');
        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Computers Inventory
      </Typography>
      {loading && <CircularProgress sx={{ my: 4 }} />}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      {!loading && !error && (
        <InventoryList items={items} />
      )}
    </Container>
  );
};

export default InventoryListPage; 