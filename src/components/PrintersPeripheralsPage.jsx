import React, { useState } from 'react';
import InventoryPage from './InventoryPage';
import printerIcon from '../assets/icons/printer.png';
import scannerIcon from '../assets/icons/scanner.png';
import peripheralIcon from '../assets/icons/peripheral.png';
import './PrintersPeripheralsPage.css';

function PrintersPeripheralsPage() {
  const [selectedType, setSelectedType] = useState('all');

  const printerColumns = {
    DEVICE: {
      TYPE: 'Type',
      SERIAL_NO: 'Serial No.',
      PROPERTY_NO: 'Property No.',
      BRAND_MODEL: 'Brand/Model'
    },
    COMMON: {
      UNIT_COST: 'UNIT COST',
      DATE: 'DATE',
      ACCT_PERSON: 'ACCT. PERSON',
      STATUS: 'STATUS  (SERVICEABLE/ UNSERVICEABLE)',
      LOCATION: 'LOCATION',
      USER: 'USER'
    }
  };

  const deviceTypes = [
    { id: 'printer', name: 'Printer', icon: printerIcon },
    { id: 'scanner', name: 'Scanner', icon: scannerIcon },
    { id: 'peripheral', name: 'Other Peripherals', icon: peripheralIcon }
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
  };

  return (
    <div className="printers-peripherals-page">
      <div className="device-type-grid">
        {deviceTypes.map(type => (
          <div 
            key={type.id} 
            className={`device-type-card ${selectedType === type.id ? 'active' : ''}`}
            onClick={() => handleTypeSelect(type.id)}
          >
            <img src={type.icon} alt={type.name} className="device-icon" />
            <span>{type.name}</span>
          </div>
        ))}
      </div>
      <InventoryPage 
        type="PRINTERS"
        columns={printerColumns}
        className="printers-inventory"
        filterType={selectedType !== 'all' ? selectedType : null}
      />
    </div>
  );
}

export default PrintersPeripheralsPage; 