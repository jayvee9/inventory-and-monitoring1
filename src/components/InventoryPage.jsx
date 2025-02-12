import React, { useState, useEffect, useCallback } from 'react';
import InventoryList from './InventoryList';
import AddInventoryForm from './AddInventoryForm';
import { sheetService } from '../services/sheetService';

function InventoryPage({ type }) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
  const [submitStatus, setSubmitStatus] = useState({ show: false, message: '', type: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sheetService.getAllItems(type);
      setInventoryItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems, refreshTrigger]);

  const handleSort = (field) => {
    setSortConfig(prevSort => ({
      field,
      direction: prevSort.field === field && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const addInventoryItem = async (newItem) => {
    try {
      setLoading(true);
      console.log('Adding new item:', newItem);
      
      await sheetService.addItem(newItem, type);
      
      setSubmitStatus({
        show: true,
        message: `${type} item added successfully!`,
        type: 'success'
      });
      
      setShowAddForm(false);
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error('Error adding item:', error);
      setSubmitStatus({
        show: true,
        message: `Failed to add ${type} item: ${error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>{type} Inventory</h1>
      
      {loading && (
        <div className="loading-spinner">Loading...</div>
      )}
      
      {error && (
        <div className="error-alert">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {submitStatus.show && (
        <div className={`status-alert ${submitStatus.type}`}>
          {submitStatus.message}
          <button onClick={() => setSubmitStatus({ show: false, message: '', type: '' })}>✕</button>
        </div>
      )}

      <div className="actions">
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
          disabled={loading}
        >
          Add New {type}
        </button>
      </div>

      {showAddForm && (
        <AddInventoryForm
          type={type}
          onSubmit={addInventoryItem}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {!loading && (
        <InventoryList
          items={inventoryItems}
          type={type}
          onSort={handleSort}
          sortConfig={sortConfig}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          filters={filters}
          onFilter={handleFilter}
        />
      )}
    </div>
  );
}

export default InventoryPage;