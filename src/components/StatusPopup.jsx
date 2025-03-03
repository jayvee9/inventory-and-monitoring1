import React from 'react';
import './StatusPopup.css';

function StatusPopup({ status, date, isOpen, onClose, disposalInfo }) {
  if (!isOpen) return null;

  const calculateNextMaintenance = (lastDate) => {
    const maintenanceDate = new Date(lastDate);
    maintenanceDate.setMonth(maintenanceDate.getMonth() + 3);
    return maintenanceDate.toLocaleDateString();
  };

  return (
    <div className="status-popup-overlay" onClick={onClose}>
      <div className="status-popup-card" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {status === 'SERVICEABLE' ? (
          <>
            <h3 className="status-title serviceable">Serviceable Unit</h3>
            <div className="maintenance-info">
              <p><strong>Last Maintenance Date:</strong> {date}</p>
              <p><strong>Next Maintenance Due:</strong> {calculateNextMaintenance(date)}</p>
              <div className="maintenance-notice">
                <i className="info-icon">ℹ</i>
                <span>This unit requires maintenance every 3 months to maintain optimal performance.</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="status-title unserviceable">Unserviceable Unit</h3>
            <div className="disposal-info">
              <p><strong>Status:</strong> {disposalInfo?.forRepair ? 'For Repair' : 'For Disposal'}</p>
              <p><strong>Location:</strong> {disposalInfo?.location || 'Warehouse'}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StatusPopup; 