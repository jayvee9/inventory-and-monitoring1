import React, { useState } from 'react';

function AddInventoryForm({ onSubmit, onCancel, type }) {
  const initialState = type === 'PRINTERS' ? {
    // Printer specific fields
    type: '', // Printer/Scanner/Peripheral
    serialNo: '',
    propertyNo: '',
    brandModel: '',
    
    // Common details
    unitCost: '',
    date: new Date().toISOString().split('T')[0],
    accountablePerson: '',
    status: 'SERVICEABLE',
    location: '',
    user: ''
  } : type === 'Laptops' ? {
    // Laptop details
    serialNo: '',
    propertyNo: '',
    brandModel: '',
    
    // Common details
    unitCost: '',
    date: new Date().toISOString().split('T')[0],
    accountablePerson: '',
    status: 'SERVICEABLE',
    location: '',
    user: '',
    remarks: '',
    pcName: ''
  } : {
    // Original computer structure
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
    // Common details
    unitCost: '',
    date: new Date().toISOString().split('T')[0],
    accountablePerson: '',
    status: 'SERVICEABLE',
    location: '',
    user: '',
    remarks: '',
    pcName: '',
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
    if (!formData.accountablePerson) newErrors.accountablePerson = 'Required';
    if (!formData.status) newErrors.status = 'Required';
    if (!formData.location) newErrors.location = 'Required';
    if (!formData.user) newErrors.user = 'Required';

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

  const handleStatusChange = (event) => {
    const status = event.target.value.toUpperCase();
    console.log('Status selected:', status);
    setFormData(prev => ({
      ...prev,
      status
    }));
  };

  return (
    <div className="add-inventory-form">
      <h2>Add New {type}</h2>
      <form onSubmit={handleSubmit}>
        {type === 'PRINTERS' && (
          <div className="form-section">
            <h3 className="form-section-title">Printer/Peripheral Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Device Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={errors.type ? 'error' : ''}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Printer">Printer</option>
                  <option value="Scanner">Scanner</option>
                  <option value="Other Peripherals">Other Peripherals</option>
                </select>
                {errors.type && <span className="error-message">{errors.type}</span>}
              </div>

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
            </div>

            <div className="form-row">
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
          </div>
        )}

        {type === 'Computers' && (
          <>
            {/* System Unit Section */}
            <div className="form-section">
              <h3 className="form-section-title">System Unit Details</h3>
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
            </div>

            {/* Monitor Section */}
            <div className="form-section">
              <h3 className="form-section-title">Monitor Details</h3>
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
            </div>
          </>
        )}

        {type === 'Laptops' && (
          <div className="form-section">
            <h3 className="form-section-title">Laptop Details</h3>
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
                {errors.serialNo && 
                  <span className="error-message">{errors.serialNo}</span>}
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
                {errors.propertyNo && 
                  <span className="error-message">{errors.propertyNo}</span>}
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
                {errors.brandModel && 
                  <span className="error-message">{errors.brandModel}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Common Details Section */}
        <div className="form-section">
          <h3 className="form-section-title">Common Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Unit Cost *</label>
              <div className="peso-input-wrapper">
                <span className="peso-symbol">₱</span>
                <input
                  type="number"
                  name="unitCost"
                  value={formData.unitCost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={errors.unitCost ? 'error' : ''}
                  placeholder="0.00"
                />
              </div>
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
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                required
              >
                <option value="SERVICEABLE">SERVICEABLE</option>
                <option value="UNSERVICEABLE">UNSERVICEABLE</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Accountable Person *</label>
              <input
                type="text"
                name="accountablePerson"
                value={formData.accountablePerson}
                onChange={handleChange}
                className={errors.accountablePerson ? 'error' : ''}
              />
              {errors.accountablePerson && 
                <span className="error-message">{errors.accountablePerson}</span>}
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

            <div className="form-group">
              <label>User *</label>
              <input
                type="text"
                name="user"
                value={formData.user}
                onChange={handleChange}
                className={errors.user ? 'error' : ''}
              />
              {errors.user && <span className="error-message">{errors.user}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>PC Name *</label>
              <input
                type="text"
                name="pcName"
                value={formData.pcName}
                onChange={handleChange}
                className={errors.pcName ? 'error' : ''}
              />
              {errors.pcName && <span className="error-message">{errors.pcName}</span>}
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Item
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddInventoryForm; 