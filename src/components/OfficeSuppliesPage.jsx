import React, { useState, useEffect } from 'react';
import { sheetService, HEADERS } from '../services/sheetService';
import RequestSupplyForm from './RequestSupplyForm';
import './OfficeSuppliesPage.css';

function OfficeSuppliesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ show: false, type: '', message: '' });

  const categories = [
    { id: 'paper', name: 'Paper Products' },
    { id: 'writing', name: 'Writing Tools' },
    { id: 'office', name: 'Office Equipment' },
    { id: 'storage', name: 'Storage Items' }
  ];

  // Move fetchSupplies outside useEffect so it can be reused
  const fetchSupplies = async () => {
    try {
      setLoading(true);
      console.log('Fetching supplies data...');
      const data = await sheetService.getAllItems('SUPPLIES');
      console.log('Received supplies data:', data);
      setSupplies(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching supplies:', err);
      setError('Failed to load supplies data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const filteredSupplies = supplies.filter(item => {
    if (selectedCategory === 'all') return true;
    return item[HEADERS.SUPPLIES.ITEM]?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleRequestSubmit = async (requestData) => {
    try {
      setLoading(true);
      console.log('Submitting supply request...', requestData);
      
      // Format the data to exactly match the sheet column names
      const formattedData = {
        'Item': requestData.itemName,
        'Inventory Minimum': requestData.inventoryMinimum.toString(),
        'Quantity': requestData.quantity.toString(),
        'Units': requestData.units,
        'Purpose': requestData.purpose,
        'Requester': requestData.requesterName
      };

      console.log('Formatted data:', formattedData);
      
      const response = await sheetService.addItem(formattedData, 'SUPPLIES');
      
      if (response) {
        setShowRequestForm(false);
        setStatusMessage({
          show: true,
          type: 'success',
          message: 'Supply request submitted successfully!'
        });
        
        // Refresh the supplies list
        await fetchSupplies();
      }
    } catch (err) {
      console.error('Error submitting supply request:', err);
      setStatusMessage({
        show: true,
        type: 'error',
        message: 'Failed to submit supply request: ' + err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSuppliesTable = () => {
    if (loading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <table className="inventory-table">
        <thead>
          <tr className="header-groups">
            <th colSpan="6" className="header-group supplies">Office Supplies Inventory</th>
          </tr>
          <tr>
            <th>Supply Item</th>
            <th>Inventory Minimum</th>
            <th>Quantity</th>
            <th>Units</th>
            <th>Purpose</th>
            <th>Requester's Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredSupplies.map((item, index) => (
            <tr key={index}>
              <td>{item[HEADERS.SUPPLIES.ITEM] || '-'}</td>
              <td>{item[HEADERS.SUPPLIES.MIN_INVENTORY] || '-'}</td>
              <td>{item[HEADERS.SUPPLIES.QUANTITY] || '-'}</td>
              <td>{item[HEADERS.SUPPLIES.UNITS] || '-'}</td>
              <td>{item[HEADERS.SUPPLIES.PURPOSE] || '-'}</td>
              <td>{item[HEADERS.SUPPLIES.REQUESTER] || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="office-supplies-page">
      <div className="page-header">
        <h1>Office Supplies Inventory</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowRequestForm(true)}
        >
          + Request New Item
        </button>
      </div>

      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RequestSupplyForm 
              onSubmit={handleRequestSubmit}
              onCancel={() => setShowRequestForm(false)}
            />
          </div>
        </div>
      )}

      {statusMessage.show && (
        <div className={`status-message ${statusMessage.type}`}>
          <span className="status-message-icon">
            {statusMessage.type === 'success' ? '✓' : '⚠'}
          </span>
          <div className="status-message-content">
            {statusMessage.message}
          </div>
          <button 
            className="status-message-close"
            onClick={() => setStatusMessage(prev => ({ ...prev, show: false }))}
          >
            ×
          </button>
        </div>
      )}

      <div className="category-filters">
        <button 
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Items
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="inventory-list-container">
        {renderSuppliesTable()}
      </div>
    </div>
  );
}

export default OfficeSuppliesPage; 