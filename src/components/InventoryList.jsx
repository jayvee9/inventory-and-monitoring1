import './InventoryList.css';
import React from 'react';
import { HEADERS } from '../services/sheetService';

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
    const statusUpper = status.trim().toUpperCase();
    return statusUpper === 'SERVICEABLE' ? 'serviceable' : 'unserviceable';
  };

  const getSafeValue = (item, key, defaultValue = '-') => {
    // Safely access nested object properties
    if (!item || !key) return defaultValue;
    return item[key] || defaultValue;
  };

  const renderTable = () => {
    if (safeItems.length === 0) {
      return <div className="no-items">No inventory items found</div>;
    }

    return (
      <table className="inventory-table">
        <thead>
          <tr>
            {type === 'PRINTERS' ? (
              <>
                <th>Type</th>
                <th>Serial No.</th>
                <th>Property No.</th>
                <th>Brand/Model</th>
              </>
            ) : (
              <>
                <th>Serial No.</th>
                <th>Property No.</th>
                <th>Brand/Model</th>
              </>
            )}
            <th>Unit Cost</th>
            <th>Date</th>
            <th>Accountable Person</th>
            <th>Status</th>
            <th>Location</th>
            <th>User</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {safeItems.map((item, index) => (
            <tr key={index}>
              {type === 'PRINTERS' ? (
                <>
                  <td>{item.type || '-'}</td>
                  <td>{item.serialNo || '-'}</td>
                  <td>{item.propertyNo || '-'}</td>
                  <td>{item.brandModel || '-'}</td>
                </>
              ) : (
                <>
                  <td>{item.serialNo || '-'}</td>
                  <td>{item.propertyNo || '-'}</td>
                  <td>{item.brandModel || '-'}</td>
                </>
              )}
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
      {renderTable()}
    </div>
  );
}

export default InventoryList; 