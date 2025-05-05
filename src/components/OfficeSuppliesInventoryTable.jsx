import React from 'react';
import './OfficeSuppliesSubCategory.css';

const SUPPLIES_HEADERS = [
  'Item & Specifications',
  'Unit of Measure',
  'Beginning Balance as of 02/01/2025',
  'Purchases for the Month',
  'Total Balance',
  'Adjustment',
  'Examination',
  'LRD',
  'Application',
  'Regulation',
  'Registration',
  'Admin',
  'ORD',
  'Valencia',
  'Iligan',
  'Total Releases',
  'Ending Balance as of 02/28/2025',
  'Unit Cost',
  'Total Amount',
  'PS/DBM Price',
  'Outside PS Price'
];

function OfficeSuppliesInventoryTable({ items }) {
  return (
    <div className="sub-category-table-container">
      <div className="main-header">
        <h2>Office Supplies Inventory</h2>
      </div>
      <table className="sub-category-table">
        <thead>
          <tr>
            {SUPPLIES_HEADERS.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td>{item.itemSpecs}</td>
                <td>{item.unitMeasure}</td>
                <td>{item.beginningBalance}</td>
                <td>{item.purchases}</td>
                <td>{item.totalBalance}</td>
                <td>{item.adjustment}</td>
                <td>{item.examination}</td>
                <td>{item.lrd}</td>
                <td>{item.application}</td>
                <td>{item.regulation}</td>
                <td>{item.registration}</td>
                <td>{item.admin}</td>
                <td>{item.ord}</td>
                <td>{item.valencia}</td>
                <td>{item.iligan}</td>
                <td>{item.totalReleases}</td>
                <td>{item.endingBalance}</td>
                <td>{item.unitCost}</td>
                <td>{item.totalAmount}</td>
                <td>{item.psPrice}</td>
                <td>{item.outsidePsPrice}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={SUPPLIES_HEADERS.length} style={{ textAlign: 'center', color: '#888' }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OfficeSuppliesInventoryTable; 