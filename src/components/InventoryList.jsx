import './InventoryList.css';
import React, { useState } from 'react';
import StatusPopup from './StatusPopup';
import ItemDetailsPopup from './ItemDetailsPopup';

const SUPPLIES_HEADERS = [
  { key: 'itemSpecifications', label: 'Item & Specifications' },
  { key: 'unitOfMeasure', label: 'Unit of Measure' },
  { key: 'beginningBalance', label: 'Beginning Balance as of 02/01/2025' },
  { key: 'purchasesForMonth', label: 'Purchases for the Month' },
  { key: 'totalBalance', label: 'Total Balance' },
  { key: 'adjustment', label: 'Adjustment' },
  { key: 'examination', label: 'Examination' },
  { key: 'lrd', label: 'LRD' },
  { key: 'application', label: 'Application' },
  { key: 'regulation', label: 'Regulation' },
  { key: 'registration', label: 'Registration' },
  { key: 'admin', label: 'Admin' },
  { key: 'ord', label: 'ORD' },
  { key: 'valencia', label: 'Valencia' },
  { key: 'iligan', label: 'Iligan' },
  { key: 'totalReleases', label: 'Total Releases' },
  { key: 'endingBalance', label: 'Ending Balance as of 02/28/2025' },
  { key: 'unitCost', label: 'Unit Cost' },
  { key: 'totalAmount', label: 'Total Amount' },
  { key: 'psPriceDBM', label: 'PS/DBM Price' },
  { key: 'outsidePSPrice', label: 'Outside PS Price' }
];

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
  { key: 'status', label: 'STATUS  (SERVICEABLE/ UNSERVICEABLE)' },
  { key: 'location', label: 'LOCATION' },
  { key: 'user', label: 'USER' },
  { key: 'pcName', label: 'PCNAME' },
  { key: 'remarks', label: 'REMARKS' }
];

const LAPTOP_HEADERS = [
  { key: 'serialNo', label: 'Serial No.' },
  { key: 'propertyNo', label: 'Property No.' },
  { key: 'brandModel', label: 'Brand/Model' },
  { key: 'unitCost', label: 'UNIT COST' },
  { key: 'date', label: 'DATE' },
  { key: 'accountablePerson', label: 'ACCT. PERSON' },
  { key: 'status', label: 'STATUS  (SERVICEABLE/ UNSERVICEABLE)' },
  { key: 'location', label: 'LOCATION' },
  { key: 'user', label: 'USER' },
  { key: 'pcName', label: 'PCNAME' },
  { key: 'remarks', label: 'REMARKS' }
];

const PRINTER_HEADERS = [
  { key: 'serialNo', label: 'Serial No.' },
  { key: 'propertyNo', label: 'Property No.' },
  { key: 'brandModel', label: 'Brand/Model' },
  { key: 'unitCost', label: 'UNIT COST' },
  { key: 'date', label: 'DATE' },
  { key: 'accountablePerson', label: 'ACCT. PERSON' },
  { key: 'status', label: 'STATUS  (SERVICEABLE/ UNSERVICEABLE)' },
  { key: 'location', label: 'LOCATION' },
  { key: 'user', label: 'USER' },
  { key: 'remarks', label: 'REMARKS' }
];

const InventoryList = ({ items, onSort, sortConfig, type, onUpdateItem }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  const safeItems = Array.isArray(items) ? items : [];
  
  // Choose headers based on type
  const getHeaders = () => {
    switch(type) {
      case 'SUPPLIES':
        return SUPPLIES_HEADERS;
      case 'LAPTOPS':
        return LAPTOP_HEADERS;
      case 'PRINTERS':
        return PRINTER_HEADERS;
      default:
        return COMPUTER_HEADERS;
    }
  };

  const headers = getHeaders();

  const formatToPeso = (value) => {
    if (typeof value === 'string') {
      value = value.replace(/[₱,]/g, '');
    }
    
    const number = parseFloat(value);
    if (!value || isNaN(number)) return '₱0.00';
    
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(number);
  };

  const handleStatusClick = (status, date) => {
    setSelectedStatus(status);
    setSelectedDate(date);
    setIsPopupOpen(true);
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setShowDetailsPopup(true);
  };

  const handleSaveDetails = (details) => {
    onUpdateItem({ ...selectedItem, ...details });
    setShowDetailsPopup(false);
  };

  return (
    <div className="table-container">
      <div className="inventory-list">
        <table>
          <thead>
            <tr>
              {headers.map(header => (
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
            {safeItems.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                {headers.map(header => (
                  <td key={header.key}>
                    {header.key === 'status' ? (
                      <span 
                        className={`status-cell ${item[header.key]?.toLowerCase()}`}
                        onClick={(e) => { e.stopPropagation(); handleStatusClick(item[header.key], item.date); }}
                      >
                        {item[header.key] || '-'}
                      </span>
                    ) : header.key.includes('Cost') || header.key.includes('Price') || header.key.includes('Amount') ? (
                      formatToPeso(item[header.key])
                    ) : (
                      item[header.key] || '-'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {isPopupOpen && selectedStatus && (
          <StatusPopup
            status={selectedStatus}
            date={selectedDate}
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
          />
        )}

        {showDetailsPopup && selectedItem && (
          <ItemDetailsPopup
            item={selectedItem}
            onSave={handleSaveDetails}
            onClose={() => setShowDetailsPopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryList;