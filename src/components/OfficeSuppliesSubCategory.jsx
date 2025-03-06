import React from 'react';
import './OfficeSuppliesSubCategory.css';

const SUB_CATEGORY_HEADERS = [
  { key: 'article', label: 'ARTICLE' },
  { key: 'description', label: 'DESCRIPTION', subHeaders: [
    { key: 'cpuModel', label: 'CPU MODEL' },
    { key: 'cpuSerialNo', label: 'CPU SERIAL NO.' },
    { key: 'monitorSerialNo', label: 'MONITOR SERIAL NO.' }
  ]},
  { key: 'propertyNo', label: 'PROPERTY NO.' },
  { key: 'unitOfMeasure', label: 'UNIT OF MEASURE' },
  { key: 'date', label: 'DATE' },
  { key: 'unitValue', label: 'UNIT VALUE' },
  { key: 'quantityPerPropertyCard', label: 'QUANTITY PER PROPERTY CARD' },
  { key: 'quantityPerPhysicalCount', label: 'QUANTITY PER PHYSICAL COUNT' },
  { key: 'shortageOverage', label: 'SHORTAGE / OVERAGE', subHeaders: [
    { key: 'quantity', label: 'QUANTITY' },
    { key: 'value', label: 'VALUE' }
  ]},
  { key: 'status', label: 'STATUS' },
  { key: 'location', label: 'LOCATION' },
  { key: 'accountablePerson', label: 'ACCT. PERSON' }
];

function OfficeSuppliesSubCategory({ items }) {
  return (
    <div className="sub-category-table-container">
      <div className="main-header">
        <h2>Semi-expandable Properties</h2>
      </div>
      <table className="sub-category-table">
        <thead>
          <tr>
            {SUB_CATEGORY_HEADERS.map(header => (
              header.subHeaders ? (
                <th key={header.key} colSpan={header.subHeaders.length}>
                  {header.label}
                </th>
              ) : (
                <th key={header.key} rowSpan={2}>{header.label}</th>
              )
            ))}
          </tr>
          <tr>
            {SUB_CATEGORY_HEADERS.map(header => 
              header.subHeaders?.map(subHeader => (
                <th key={subHeader.key}>{subHeader.label}</th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.article}</td>
              <td>{item.cpuModel}</td>
              <td>{item.cpuSerialNo}</td>
              <td>{item.monitorSerialNo}</td>
              <td>{item.propertyNo}</td>
              <td>{item.unitOfMeasure}</td>
              <td>{item.date}</td>
              <td>{item.unitValue}</td>
              <td>{item.quantityPerPropertyCard}</td>
              <td>{item.quantityPerPhysicalCount}</td>
              <td>{item.shortageOverageQuantity}</td>
              <td>{item.shortageOverageValue}</td>
              <td>{item.status}</td>
              <td>{item.location}</td>
              <td>{item.accountablePerson}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OfficeSuppliesSubCategory; 