import React, { useState } from 'react';
import './OfficeSuppliesPage.css';

function OfficeSuppliesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'paper', name: 'Paper Products' },
    { id: 'writing', name: 'Writing Tools' },
  ];

  // Sample data - replace with actual data from your API
  const supplies = [
    {
      item: 'Bond Paper A4',
      minInventory: 100,
      quantity: 500,
      units: '10',
      purpose: 'Office Documentation',
      requester: 'John Doe',
      
    },
    {
      item: 'Cartolina',
      minInventory: 10,
      quantity: 50,
      units: '1',
      purpose: 'Examination',
      requester: 'Jane Smith',
    },
    // Add more items as needed
  ];

  const renderSuppliesTable = () => {
    return (
      <table className="inventory-table">
        <thead>
          <tr className="header-groups">
            <th colSpan="6" className="header-group supplies">Office Supplies Inventory</th>
          </tr>
          <tr>
            <th>Supply Item</th>
            <th>Inventory Minimum</th>
            <th>Quantity</th>
            <th>Units</th>
            <th>Purpose</th>
            <th>Requester's Name</th>
          </tr>
        </thead>
        <tbody>
          {supplies.map((item, index) => (
            <tr key={index}>
              <td>{item.item}</td>
              <td>{item.minInventory}</td>
              <td>{item.quantity}</td>
              <td>{item.units}</td>
              <td>{item.purpose}</td>
              <td>{item.requester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="office-supplies-page">
      <div className="category-filters">
        <button 
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Items
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="inventory-list-container">
        {renderSuppliesTable()}
      </div>
    </div>
  );
}

export default OfficeSuppliesPage; 