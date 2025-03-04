import React, { useState } from 'react';
import './ItemDetailsPopup.css';

function ItemDetailsPopup({ item, onSave, onClose }) {
  const [details, setDetails] = useState({
    accountablePerson: item.accountablePerson || '',
    user: item.user || '',
    pcName: item.pcName || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(details);
  };

  return (
    <div className="details-popup-overlay">
      <div className="details-popup-card">
        <h3>Update Item Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Accountable Person</label>
            <input
              type="text"
              name="accountablePerson"
              value={details.accountablePerson}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>User</label>
            <input
              type="text"
              name="user"
              value={details.user}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>PC Name</label>
            <input
              type="text"
              name="pcName"
              value={details.pcName}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemDetailsPopup; 