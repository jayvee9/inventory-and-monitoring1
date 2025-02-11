import React from 'react';
import InventoryPage from './InventoryPage';
import './PrintersPeripheralsPage.css';

function PrintersPeripheralsPage() {
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
      STATUS: 'STATUS (SERVICEABLE/UNSERVICEABLE)',
      LOCATION: 'LOCATION',
      USER: 'USER'
    }
  };

  const deviceTypes = [
    { id: 'printer', name: 'Printer', icon: '/icons/printer.png' },
    { id: 'scanner', name: 'Scanner', icon: '/icons/scanner.png' },
    { id: 'peripheral', name: 'Other Peripherals', icon: '/icons/peripheral.png' }
  ];

  return (
    <div className="printers-peripherals-page">
      <div className="device-type-grid">
        {deviceTypes.map(type => (
          <div key={type.id} className="device-type-card">
            <img src={type.icon} alt={type.name} />
            <span>{type.name}</span>
          </div>
        ))}
      </div>
      <InventoryPage 
        type="Printers & Peripherals" 
        columns={printerColumns}
        className="printers-inventory"
      />
    </div>
  );
}

export default PrintersPeripheralsPage; 