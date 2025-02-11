import './InventoryList.css';
import React from 'react';
// import { HEADERS } from '../services/sheetService';

function InventoryList({ items, onSort, sortConfig, type }) {
  const safeItems = Array.isArray(items) ? items : [];

  const formatToPeso = (value) => {
    if (!value || isNaN(value)) return '₱0.00';
    const number = parseFloat(value);
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

  const renderComputerTable = () => {
    return (
      <table className="inventory-table">
        <thead>
          <tr className="header-groups">
            <th colSpan="3" className="header-group system-unit">System Unit</th>
            <th colSpan="3" className="header-group monitor">Monitor</th>
            <th colSpan="7" className="header-group details">Other Details</th>
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
            <th onClick={() => onSort('remarks')}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {safeItems.map((item, index) => (
            <tr key={index}>
              {/* System Unit Data */}
              <td>{item.serialNo || '-'}</td>
              <td>{item.propertyNo || '-'}</td>
              <td>{item.brandModel || '-'}</td>
              
              {/* Monitor Data */}
              <td>{item.monitorSerialNo || '-'}</td>
              <td>{item.monitorPropertyNo || '-'}</td>
              <td>{item.monitorBrandModel || '-'}</td>
              
              {/* Other Details Data */}
              <td>{formatToPeso(item.unitCost)}</td>
              <td>{item.date || '-'}</td>
              <td>{item.accountablePerson || '-'}</td>
              <td className={getStatusClass(item.status)}>{item.status || '-'}</td>
              <td>{item.location || '-'}</td>
              <td>{item.user || '-'}</td>
              <td>{item.remarks || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="inventory-list-container">
      {renderComputerTable()}
    </div>
  );
}

export default InventoryList; 