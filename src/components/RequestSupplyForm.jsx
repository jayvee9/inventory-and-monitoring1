import React, { useState } from 'react';

function RequestSupplyForm({ onSubmit, onCancel }) {
  const initialState = {
    itemName: '',
    quantity: '',
    units: '',
    purpose: '',
    requesterName: '',
    inventoryMinimum: '',
    urgency: 'normal', // normal, urgent, critical
    additionalNotes: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert empty strings to empty strings (not undefined)
    const sanitizedValue = value === undefined ? '' : value;
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName) newErrors.itemName = 'Required';
    if (!formData.quantity) newErrors.quantity = 'Required';
    if (!formData.units) newErrors.units = 'Required';
    if (!formData.purpose) newErrors.purpose = 'Required';
    if (!formData.requesterName) newErrors.requesterName = 'Required';
    if (!formData.inventoryMinimum) newErrors.inventoryMinimum = 'Required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="request-supply-form">
      <h2>Request New Supply Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName || ''}
              onChange={handleChange}
              className={errors.itemName ? 'error' : ''}
              placeholder="Enter item name"
            />
            {errors.itemName && <span className="error-message">{errors.itemName}</span>}
          </div>

          <div className="form-group">
            <label>Inventory Minimum *</label>
            <input
              type="number"
              name="inventoryMinimum"
              value={formData.inventoryMinimum || ''}
              onChange={handleChange}
              className={errors.inventoryMinimum ? 'error' : ''}
              min="0"
              placeholder="Minimum stock level"
            />
            {errors.inventoryMinimum && <span className="error-message">{errors.inventoryMinimum}</span>}
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity || ''}
              onChange={handleChange}
              className={errors.quantity ? 'error' : ''}
              min="1"
              placeholder="Enter quantity"
            />
            {errors.quantity && <span className="error-message">{errors.quantity}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Units *</label>
            <input
              type="text"
              name="units"
              value={formData.units || ''}
              onChange={handleChange}
              className={errors.units ? 'error' : ''}
              placeholder="e.g., pieces, boxes"
            />
            {errors.units && <span className="error-message">{errors.units}</span>}
          </div>

          <div className="form-group">
            <label>Purpose *</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose || ''}
              onChange={handleChange}
              className={errors.purpose ? 'error' : ''}
              placeholder="Enter purpose"
            />
            {errors.purpose && <span className="error-message">{errors.purpose}</span>}
          </div>

          <div className="form-group">
            <label>Requester's Name *</label>
            <input
              type="text"
              name="requesterName"
              value={formData.requesterName || ''}
              onChange={handleChange}
              className={errors.requesterName ? 'error' : ''}
              placeholder="Enter your name"
            />
            {errors.requesterName && <span className="error-message">{errors.requesterName}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Submit Request</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default RequestSupplyForm; 