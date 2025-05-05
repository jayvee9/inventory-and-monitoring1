import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import {
  Button,
  TextField,
  Grid,
} from '@mui/material';
import './PrintersPeripheralsPage.css';

function PrintersPeripheralsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    serialNo: '',
    propertyNo: '',
    brandModel: '',
    unitCost: '',
    date: '',
    status: '',
    location: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('printers_peripherals').select('*');
      if (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('printers_peripherals')
        .insert([{
          type: formData.type,
          serial_no: formData.serialNo,
          property_no: formData.propertyNo,
          brand_model: formData.brandModel,
          unit_cost: formData.unitCost,
          date: formData.date,
          status: formData.status || 'SERVICEABLE',
          location: formData.location,
        }]);

      if (error) throw error;

      setFormData({
        type: '',
        serialNo: '',
        propertyNo: '',
        brandModel: '',
        unitCost: '',
        date: '',
        status: '',
        location: '',
      });
      setShowForm(false);
      await fetchData();
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="printers-peripherals-page">
      <div className="page-header">
        <h2>Printers & Peripherals Inventory</h2>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setShowForm(true)}
          style={{ marginBottom: '20px', marginLeft: 'auto' }}
        >
          Add New Item
        </Button>
      </div>
      <div className="inventory-list">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Serial No.</th>
              <th>Property No.</th>
              <th>Brand/Model</th>
              <th>Unit Cost</th>
              <th>Date</th>
              <th>Acct. Person</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.type || '-'}</td>
                <td>{item.serial_no || '-'}</td>
                <td>{item.property_no || '-'}</td>
                <td>{item.brand_model || '-'}</td>
                <td>{item.unit_cost || '-'}</td>
                <td>{item.date || '-'}</td>
                <td>{item.acct_person || '-'}</td>
                <td>
                  <span className={`status-cell ${item.status && item.status.toLowerCase() === 'serviceable' ? 'serviceable' : 'unserviceable'}`}>
                    {item.status || '-'}
                  </span>
                </td>
                <td>{item.location || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h2>Add New Printer/Peripheral</h2>
              <button className="close-form-button" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="add-inventory-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="e.g., Printer, Scanner, etc."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="serialNo">Serial Number</label>
                  <input
                    type="text"
                    id="serialNo"
                    name="serialNo"
                    value={formData.serialNo}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="propertyNo">Property Number</label>
                  <input
                    type="text"
                    id="propertyNo"
                    name="propertyNo"
                    value={formData.propertyNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="brandModel">Brand/Model</label>
                  <input
                    type="text"
                    id="brandModel"
                    name="brandModel"
                    value={formData.brandModel}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="unitCost">Unit Cost</label>
                  <input
                    type="number"
                    id="unitCost"
                    name="unitCost"
                    value={formData.unitCost}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option value="SERVICEABLE">SERVICEABLE</option>
                    <option value="UNSERVICEABLE">UNSERVICEABLE</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">Add Item</button>
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrintersPeripheralsPage; 