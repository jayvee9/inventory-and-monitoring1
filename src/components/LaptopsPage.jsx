import React from 'react';
import InventoryPage from './InventoryPage';
import './LaptopsPage.css';

function LaptopsPage() {
  const laptopColumns = {
    LAPTOP: {
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
      USER: 'USER',
      REMARKS: 'REMARKS',
      PCNAME: 'PCNAME'
    }
  };

  return (
    <div className="laptops-page">
      <div className="page-header">
        <img 
          src="/icons/laptop-icon.png" 
          alt="Laptop Icon" 
          className="category-icon"
        />
      </div>
      <InventoryPage 
        type="Laptops" 
        columns={laptopColumns}
        className="laptops-inventory"
      />
    </div>
  );
}

export default LaptopsPage; 