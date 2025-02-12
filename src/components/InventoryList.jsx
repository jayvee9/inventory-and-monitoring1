import './InventoryList.css';
import React, { useState } from 'react';
import StatusPopup from './StatusPopup';
// import { HEADERS } from '../services/sheetService';

function InventoryList({ items, onSort, sortConfig, type }) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const safeItems = Array.isArray(items) ? items : [];

  const formatToPeso = (value) => {
    // Remove any currency symbols and commas from string values
    if (typeof value === 'string') {
      value = value.replace(/[₱,]/g, '');
    }
    
    const number = parseFloat(value);
    if (!value || isNaN(number)) return '₱0.00';
    
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(number);
  };

  const getStatusClass = (status) => {
    if (!status || typeof status !== 'string') return '';
    const statusLower = status.trim().toUpperCase();
    return statusLower === 'SERVICEABLE' ? 'serviceable' : 'unserviceable';
  };

  // Remove getSafeValue if not being used
  /* const getSafeValue = (item, key, defaultValue = '-') => {
    if (!item || !key) return defaultValue;
    return item[key] || defaultValue;
  }; */

  const handleStatusClick = (status, date, remarks) => {
    setSelectedStatus({ status, date, disposalInfo: { remarks, disposed: remarks?.toLowerCase().includes('disposed') } });
    setIsPopupOpen(true);
  };

  const renderPrintersTable = () => {
    return (
      <table className="inventory-table">
        <thead>
          <tr className="header-groups">
            <th colSpan="10" className="header-group printers-peripherals">Printers and Peripherals Inventory</th>
          </tr>
          <tr>
            <th onClick={() => onSort('type')}>Type</th>
            <th onClick={() => onSort('serialNo')}>Serial No.</th>
            <th onClick={() => onSort('propertyNo')}>Property No.</th>
            <th onClick={() => onSort('brandModel')}>Brand/Model</th>
            <th onClick={() => onSort('unitCost')}>UNIT COST</th>
            <th onClick={() => onSort('date')}>DATE</th>
            <th onClick={() => onSort('accountablePerson')}>ACCT. PERSON</th>
            <th onClick={() => onSort('status')}>STATUS</th>
            <th onClick={() => onSort('location')}>LOCATION</th>
            <th onClick={() => onSort('user')}>USER</th>
          </tr>
        </thead>
        <tbody>
          {safeItems.map((item, index) => (
            <tr key={index}>
              <td>{item.type || '-'}</td>
              <td>{item.serialNo || '-'}</td>
              <td>{item.propertyNo || '-'}</td>
              <td>{item.brandModel || '-'}</td>
              <td>{formatToPeso(item.unitCost)}</td>
              <td>{item.date || '-'}</td>
              <td>{item.accountablePerson || '-'}</td>
              <td 
                className={getStatusClass(item.status)}
                onClick={() => handleStatusClick(item.status, item.date, item.remarks)}
                style={{ cursor: 'pointer' }}
              >
                {item.status || '-'}
              </td>
              <td>{item.location || '-'}</td>
              <td>{item.user || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderComputerTable = () => {
    return (
      <table className="inventory-table">
        <thead>
          <tr className="header-groups">
            <th colSpan="3" className="header-group system-unit">System Unit</th>
            <th colSpan="3" className="header-group monitor">Monitor</th>
            <th colSpan="8" className="header-group details">Other Details</th>
          </tr>
          <tr>
            {/* System Unit Headers */}
            <th onClick={() => onSort('serialNo')}>Serial No.</th>
            <th onClick={() => onSort('propertyNo')}>Property No.</th>
            <th onClick={() => onSort('brandModel')}>Brand/Model</th>
            
            {/* Monitor Headers */}
            <th onClick={() => onSort('monitorSerialNo')}>Serial No.</th>
            <th onClick={() => onSort('monitorPropertyNo')}>Property No.</th>
            <th onClick={() => onSort('monitorBrandModel')}>Brand/Model</th>
            
            {/* Other Details Headers */}
            <th onClick={() => onSort('unitCost')}>Unit Cost</th>
            <th onClick={() => onSort('date')}>Date</th>
            <th onClick={() => onSort('accountablePerson')}>Acct. Person</th>
            <th onClick={() => onSort('status')}>Status</th>
            <th onClick={() => onSort('location')}>Location</th>
            <th onClick={() => onSort('user')}>User</th>
            <th onClick={() => onSort('pcName')}>PC Name</th>
            <th onClick={() => onSort('remarks')}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {safeItems.map((item, index) => (
            <tr key={index}>
              <td>{item.serialNo || '-'}</td>
              <td>{item.propertyNo || '-'}</td>
              <td>{item.brandModel || '-'}</td>
              <td>{item.monitorSerialNo || '-'}</td>
              <td>{item.monitorPropertyNo || '-'}</td>
              <td>{item.monitorBrandModel || '-'}</td>
              <td>{formatToPeso(item.unitCost)}</td>
              <td>{item.date || '-'}</td>
              <td>{item.accountablePerson || '-'}</td>
              <td 
                className={getStatusClass(item.status)}
                onClick={() => handleStatusClick(item.status, item.date, item.remarks)}
                style={{ cursor: 'pointer' }}
              >
                {item.status || '-'}
              </td>
              <td>{item.location || '-'}</td>
              <td>{item.user || '-'}</td>
              <td>{item.pcName || '-'}</td>
              <td>{item.remarks || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="inventory-list-container">
      {type === 'PRINTERS' ? renderPrintersTable() : renderComputerTable()}
      <StatusPopup
        status={selectedStatus?.status}
        date={selectedStatus?.date}
        disposalInfo={selectedStatus?.disposalInfo}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}

export default InventoryList; 