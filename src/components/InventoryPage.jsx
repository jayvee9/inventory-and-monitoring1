import React, { useState, useEffect, useCallback } from 'react';
import InventoryList from './InventoryList';
import AddInventoryForm from './AddInventoryForm';
import { sheetService } from '../services/sheetService';
import './InventoryPage.css';

const InventoryPage = ({ type }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await sheetService.getAllItems(type);
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig?.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
  };

  const handleAddItem = async (newItem) => {
    try {
      await sheetService.addItem(newItem, type);
      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item');
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="inventory-page">
      <AddInventoryForm onSubmit={handleAddItem} type={type} />
      <InventoryList 
        items={items} 
        onSort={handleSort}
        sortConfig={sortConfig}
        type={type}
      />
    </div>
  );
};

export default InventoryPage;