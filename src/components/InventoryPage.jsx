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
      let data = await sheetService.getAllItems(type);
      
      // Apply status filter
      if (filters.STATUS) {
        data = data.filter(item => 
          item.status && item.status.trim().toUpperCase() === filters.STATUS.trim().toUpperCase()
        );
      }
      
      // Apply sort if needed
      if (sortConfig.field) {
        data = sheetService.sortItems(data, sortConfig.field, sortConfig.direction);
      }
      
      setInventoryItems(data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch ${type} items`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type, filters, sortConfig]);

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
      await sheetService.addItem(newItem, type);
      setSubmitStatus({
        show: true,
        message: `${type} item added successfully!`,
        type: 'success'
      });
      setShowAddForm(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
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
      <h1>{type} Inventory and Monitoring</h1>
      
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

      <div className="search-filter-container">
        <input
          type="text"
          placeholder={`Search ${type.toLowerCase()}...`}
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        
        <select
          onChange={(e) => handleFilter('STATUS', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="SERVICEABLE">SERVICEABLE</option>
          <option value="UNSERVICEABLE">UNSERVICEABLE</option>
        </select>
      </div>
      
      <div className="actions">
        <button 
          className="btn btn-secondary"
          onClick={() => setRefreshTrigger(prev => prev + 1)}
          disabled={loading}
        >
          ↻ Refresh Data
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading}
        >
          {showAddForm ? '✕ Close Form' : `+ Add New ${type}`}
        </button>
      </div>

      {showAddForm && (
        <AddInventoryForm 
          onSubmit={addInventoryItem}
          onCancel={() => setShowAddForm(false)}
          disabled={loading}
          type={type}
        />
      )}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <InventoryList 
          items={inventoryItems}
          onSort={handleSort}
          sortConfig={sortConfig}
          type={type}
        />
      )}
    </div>
  );
}

export default InventoryPage; 