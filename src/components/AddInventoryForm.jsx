import React, { useState } from 'react';
import './AddInventoryForm.css';

const AddInventoryForm = ({ onSubmit, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const initialState = {
    serialNo: '',
    propertyNo: '',
    brandModel: '',
    monitorSerialNo: '',
    monitorPropertyNo: '',
    monitorBrandModel: '',
    unitCost: '',
    date: '',
    location: '',
    status: 'SERVICEABLE'
  };

  const [formData, setFormData] = useState(initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData(initialState);
      setIsExpanded(false); // Close form after submission
      alert('Item added successfully!');
    } catch (error) {
      alert('Failed to add item');
      console.error('Error adding item:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isExpanded) {
    return (
      <button 
        className="add-item-button"
        onClick={() => setIsExpanded(true)}
      >
        + Add Item
      </button>
    );
  }

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Add New Item</h2>
          <button 
            className="close-form-button"
            onClick={() => setIsExpanded(false)}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-inventory-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="serialNo">Serial No.</label>
              <input
                type="text"
                id="serialNo"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="propertyNo">Property No.</label>
              <input
                type="text"
                id="propertyNo"
                name="propertyNo"
                value={formData.propertyNo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
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
            <div className="form-group">
              <label htmlFor="monitorSerialNo">Monitor Serial No.</label>
              <input
                type="text"
                id="monitorSerialNo"
                name="monitorSerialNo"
                value={formData.monitorSerialNo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="monitorPropertyNo">Monitor Property No.</label>
              <input
                type="text"
                id="monitorPropertyNo"
                name="monitorPropertyNo"
                value={formData.monitorPropertyNo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="monitorBrandModel">Monitor Brand/Model</label>
              <input
                type="text"
                id="monitorBrandModel"
                name="monitorBrandModel"
                value={formData.monitorBrandModel}
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
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">Add Item</button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInventoryForm; 