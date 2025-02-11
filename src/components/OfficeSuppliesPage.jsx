import React, { useState } from 'react';
import './OfficeSuppliesPage.css';

function OfficeSuppliesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'paper', name: 'Paper Products' },
    { id: 'writing', name: 'Writing Tools' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'misc', name: 'Miscellaneous' }
  ];

  const supplyColumns = {
    ITEM: {
      NAME: 'Item Name',
      CATEGORY: 'Category',
      QUANTITY: 'Stock Quantity'
    },
    COMMON: {
      UNIT_COST: 'UNIT COST',
      DATE: 'DATE',
      ACCT_PERSON: 'ACCT. PERSON',
      STATUS: 'STATUS (AVAILABLE/OUT OF STOCK)',
      LOCATION: 'LOCATION',
      USER: 'USER'
    }
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
      <div className="supplies-grid">
        {/* Supply cards will be rendered here */}
      </div>
    </div>
  );
}

export default OfficeSuppliesPage; 