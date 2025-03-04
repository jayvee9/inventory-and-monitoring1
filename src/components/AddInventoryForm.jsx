import React, { useState } from 'react';
import './AddInventoryForm.css';

function AddInventoryForm({ onSubmit, onCancel, type }) {
  const initialState = type === 'PRINTERS' ? {
    type: '',
    serialNo: '',
    propertyNo: '',
    brandModel: '',
    unitCost: '',
    date: new Date().toISOString().split('T')[0],
    status: 'SERVICEABLE',
    location: ''
  } : type === 'Laptops' ? {
    serialNo: '',
    propertyNo: '',
    brandModel: '',
    unitCost: '',
    date: new Date().toISOString().split('T')[0],
    status: 'SERVICEABLE',
    location: ''
  } : {
    systemUnit: {
      serialNo: '',
      propertyNo: '',
      brandModel: '',
    },
    monitor: {
      serialNo: '',
      propertyNo: '',
      brandModel: '',
    },
    unitCost: '',
    date: new Date().toISOString().split('T')[0],
    status: 'SERVICEABLE',
    location: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (type === 'Computers') {
      // Handle nested computer form data
      if (name.startsWith('systemUnit.') || name.startsWith('monitor.')) {
        const [section, field] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      // Handle flat form data for laptops and printers
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (type === 'PRINTERS') {
      // Validate Printer fields
      if (!formData.type) newErrors.type = 'Required';
      if (!formData.serialNo) newErrors.serialNo = 'Required';
      if (!formData.propertyNo) newErrors.propertyNo = 'Required';
      if (!formData.brandModel) newErrors.brandModel = 'Required';
    } else if (type === 'Computers') {
      // Validate Computer fields
      if (!formData.systemUnit.serialNo) newErrors['systemUnit.serialNo'] = 'Required';
      if (!formData.systemUnit.propertyNo) newErrors['systemUnit.propertyNo'] = 'Required';
      if (!formData.systemUnit.brandModel) newErrors['systemUnit.brandModel'] = 'Required';
      if (!formData.monitor.serialNo) newErrors['monitor.serialNo'] = 'Required';
      if (!formData.monitor.propertyNo) newErrors['monitor.propertyNo'] = 'Required';
      if (!formData.monitor.brandModel) newErrors['monitor.brandModel'] = 'Required';
    } else if (type === 'Laptops') {
      // Validate Laptop fields
      if (!formData.serialNo) newErrors.serialNo = 'Required';
      if (!formData.propertyNo) newErrors.propertyNo = 'Required';
      if (!formData.brandModel) newErrors.brandModel = 'Required';
    }

    // Common validations
    if (!formData.unitCost) newErrors.unitCost = 'Required';
    if (!formData.date) newErrors.date = 'Required';
    if (!formData.status) newErrors.status = 'Required';
    if (!formData.location) newErrors.location = 'Required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        // Format dates to match sheet format
        const formattedData = {
          ...formData,
          date: new Date(formData.date).toLocaleDateString('en-US'),
          status: formData.status.toUpperCase(),
          unitCost: formData.unitCost.toString()
        };
        
        await onSubmit(formattedData);
        resetForm();
      } catch (error) {
        setErrors({ submit: error.message });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleStatusChange = (event) => {
    const status = event.target.value.toUpperCase();
    console.log('Status selected:', status);
    setFormData(prev => ({
      ...prev,
      status
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  return (
    <div className="add-inventory-form">
      <h2>Add New {type}</h2>
      <form onSubmit={handleSubmit}>
        {type === 'COMPUTERS' ? (
          <>
            <div className="form-section">
              <h3>System Unit</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Serial No. *</label>
                  <input
                    type="text"
                    name="systemUnit.serialNo"
                    value={formData.systemUnit.serialNo}
                    onChange={handleChange}
                    className={errors['systemUnit.serialNo'] ? 'error' : ''}
                  />
                  {errors['systemUnit.serialNo'] && 
                    <span className="error-message">{errors['systemUnit.serialNo']}</span>}
                </div>

                <div className="form-group">
                  <label>Property No. *</label>
                  <input
                    type="text"
                    name="systemUnit.propertyNo"
                    value={formData.systemUnit.propertyNo}
                    onChange={handleChange}
                    className={errors['systemUnit.propertyNo'] ? 'error' : ''}
                  />
                  {errors['systemUnit.propertyNo'] && 
                    <span className="error-message">{errors['systemUnit.propertyNo']}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Brand/Model *</label>
                <input
                  type="text"
                  name="systemUnit.brandModel"
                  value={formData.systemUnit.brandModel}
                  onChange={handleChange}
                  className={errors['systemUnit.brandModel'] ? 'error' : ''}
                />
                {errors['systemUnit.brandModel'] && 
                  <span className="error-message">{errors['systemUnit.brandModel']}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Monitor</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Serial No. *</label>
                  <input
                    type="text"
                    name="monitor.serialNo"
                    value={formData.monitor.serialNo}
                    onChange={handleChange}
                    className={errors['monitor.serialNo'] ? 'error' : ''}
                  />
                  {errors['monitor.serialNo'] && 
                    <span className="error-message">{errors['monitor.serialNo']}</span>}
                </div>

                <div className="form-group">
                  <label>Property No. *</label>
                  <input
                    type="text"
                    name="monitor.propertyNo"
                    value={formData.monitor.propertyNo}
                    onChange={handleChange}
                    className={errors['monitor.propertyNo'] ? 'error' : ''}
                  />
                  {errors['monitor.propertyNo'] && 
                    <span className="error-message">{errors['monitor.propertyNo']}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Brand/Model *</label>
                <input
                  type="text"
                  name="monitor.brandModel"
                  value={formData.monitor.brandModel}
                  onChange={handleChange}
                  className={errors['monitor.brandModel'] ? 'error' : ''}
                />
                {errors['monitor.brandModel'] && 
                  <span className="error-message">{errors['monitor.brandModel']}</span>}
              </div>
            </div>
          </>
        ) : (
          <div className="form-row">
            <div className="form-group">
              <label>Serial No. *</label>
              <input
                type="text"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleChange}
                className={errors.serialNo ? 'error' : ''}
              />
              {errors.serialNo && <span className="error-message">{errors.serialNo}</span>}
            </div>

            <div className="form-group">
              <label>Property No. *</label>
              <input
                type="text"
                name="propertyNo"
                value={formData.propertyNo}
                onChange={handleChange}
                className={errors.propertyNo ? 'error' : ''}
              />
              {errors.propertyNo && <span className="error-message">{errors.propertyNo}</span>}
            </div>

            <div className="form-group">
              <label>Brand/Model *</label>
              <input
                type="text"
                name="brandModel"
                value={formData.brandModel}
                onChange={handleChange}
                className={errors.brandModel ? 'error' : ''}
              />
              {errors.brandModel && <span className="error-message">{errors.brandModel}</span>}
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Unit Cost *</label>
            <input
              type="number"
              name="unitCost"
              value={formData.unitCost}
              onChange={handleChange}
              className={errors.unitCost ? 'error' : ''}
            />
            {errors.unitCost && <span className="error-message">{errors.unitCost}</span>}
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">Add {type}</button>
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddInventoryForm; 