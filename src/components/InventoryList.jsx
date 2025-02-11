import React from 'react';
import { HEADERS } from '../services/sheetService';

function InventoryList({ items, onSort, sortConfig, type }) {
  // Ensure items is always an array
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
    // Add null check for status
    if (!status || typeof status !== 'string') return '';
    const statusLower = status.toLowerCase().trim();
    return statusLower === 'serviceable' ? 'serviceable' : 'unserviceable';
  };

  const getSafeValue = (item, key, defaultValue = '-') => {
    // Safely access nested object properties
    if (!item || !key) return defaultValue;
    return item[key] || defaultValue;
  };

  const renderTable = () => (
    <table className="inventory-table">
      <thead>
        <tr className="header-group">
          <th colSpan="3" className="category-header">System Unit</th>
          <th colSpan="3" className="category-header">Monitor</th>
          <th colSpan="8" className="category-header">Common Information</th>
        </tr>
        <tr>
          <th className="sub-header">Serial No.</th>
          <th className="sub-header">Property No.</th>
          <th className="sub-header">Brand/Model</th>
          <th className="sub-header">Serial No.</th>
          <th className="sub-header">Property No.</th>
          <th className="sub-header">Brand/Model</th>
          <th className="sub-header">Unit Cost</th>
          <th className="sub-header">Date</th>
          <th className="sub-header">Acct. Person</th>
          <th className="sub-header">Status</th>
          <th className="sub-header">Location</th>
          <th className="sub-header">User</th>
          <th className="sub-header">Remarks</th>
          <th className="sub-header">PC Name</th>
        </tr>
      </thead>
      <tbody>
        {safeItems.map((item, index) => (
          <tr key={index}>
            {/* System Unit Fields */}
            <td>{getSafeValue(item, HEADERS.SYSTEM_UNIT.SERIAL_NO)}</td>
            <td>{getSafeValue(item, HEADERS.SYSTEM_UNIT.PROPERTY_NO)}</td>
            <td>{getSafeValue(item, HEADERS.SYSTEM_UNIT.BRAND_MODEL)}</td>
            
            {/* Monitor Fields */}
            <td>{getSafeValue(item, HEADERS.MONITOR.SERIAL_NO)}</td>
            <td>{getSafeValue(item, HEADERS.MONITOR.PROPERTY_NO)}</td>
            <td>{getSafeValue(item, HEADERS.MONITOR.BRAND_MODEL)}</td>
            
            {/* Common Fields */}
            <td className="unit-cost-cell">
              {formatToPeso(getSafeValue(item, HEADERS.COMMON.UNIT_COST, 0))}
            </td>
            <td>{getSafeValue(item, HEADERS.COMMON.DATE)}</td>
            <td>{getSafeValue(item, HEADERS.COMMON.ACCT_PERSON)}</td>
            <td className={`status-cell ${getStatusClass(getSafeValue(item, HEADERS.COMMON.STATUS))}`}>
              {getSafeValue(item, HEADERS.COMMON.STATUS)}
            </td>
            <td>{getSafeValue(item, HEADERS.COMMON.LOCATION)}</td>
            <td>{getSafeValue(item, HEADERS.COMMON.USER)}</td>
            <td>{getSafeValue(item, HEADERS.COMMON.REMARKS)}</td>
            <td>{getSafeValue(item, HEADERS.COMMON.PCNAME)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="inventory-list">
      <h2 className="section-title">Inventory List of {type}</h2>
      {safeItems.length === 0 ? (
        <div className="no-data">No inventory items found</div>
      ) : (
        renderTable()
      )}
    </div>
  );
}

export default InventoryList; 