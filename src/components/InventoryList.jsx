import './InventoryList.css';
import React, { useState } from 'react';
import StatusPopup from './StatusPopup';

const COMPUTER_HEADERS = [
  { key: 'serialNo', label: 'Serial No.' },
  { key: 'propertyNo', label: 'Property No.' },
  { key: 'brandModel', label: 'Brand/Model' },
  { key: 'monitorSerialNo', label: 'Monitor Serial No.' },
  { key: 'monitorPropertyNo', label: 'Monitor Property No.' },
  { key: 'monitorBrandModel', label: 'Monitor Brand/Model' },
  { key: 'unitCost', label: 'UNIT COST' },
  { key: 'date', label: 'DATE' },
  { key: 'accountablePerson', label: 'ACCT. PERSON' },
  { key: 'status', label: 'STATUS (SERVICEABLE/UNSERVICEABLE)' },
  { key: 'location', label: 'LOCATION' }
];

const InventoryList = ({ items, onSort, sortConfig, type }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleStatusClick = (item) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  const formatToPeso = (value) => {
    if (!value) return '₱0.00';
    const number = parseFloat(value);
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(number);
  };

  return (
    <div className="inventory-list">
      <table>
        <thead>
          <tr>
            {COMPUTER_HEADERS.map(header => (
              <th 
                key={header.key}
                onClick={() => onSort && onSort(header.key)}
                className={sortConfig?.field === header.key ? `sorted-${sortConfig.direction}` : ''}
              >
                {header.label}
                {sortConfig?.field === header.key && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
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
              <td>
                <span 
                  className={`status-cell ${item.status?.toLowerCase()}`}
                  onClick={() => handleStatusClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.status || '-'}
                </span>
              </td>
              <td>{item.location || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <StatusPopup
        status={selectedItem?.status}
        date={selectedItem?.date}
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          setSelectedItem(null);
        }}
        disposalInfo={{
          forRepair: false,
          location: 'Warehouse'
        }}
      />
    </div>
  );
};

export default InventoryList;