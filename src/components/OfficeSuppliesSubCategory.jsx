import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './OfficeSuppliesSubCategory.css';

const supabaseUrl = 'https://xhmomrolqwicnzayewky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobW9tcm9scXdpY256YXlld2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTQ2NDksImV4cCI6MjA1ODYzMDY0OX0.52keJ2RWDgjKLxHwbq272NsWqNPohHhTxOpi4zqkJbY';
const supabase = createClient(supabaseUrl, supabaseKey);

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

function OfficeSuppliesSubCategory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('semi_expandable_properties').select('*');
      if (error) {
        setError('Failed to fetch data');
        setItems([]);
      } else {
        const mapped = data.map(row => ({
          article: row.article,
          cpuModel: row.cpu_model,
          cpuSerialNo: row.cpu_serial_no,
          monitorSerialNo: row.monitor_serial_no,
          propertyNo: row.property_no,
          unitOfMeasure: row.unit_of_measure,
          date: row.date,
          unitValue: row.unit_value,
          quantityPerPropertyCard: row.quantity_per_property_card,
          quantityPerPhysicalCount: row.quantity_per_physical_count,
          shortageOverageQuantity: row.shortage_overage_quantity,
          shortageOverageValue: row.shortage_overage_value,
          status: row.status,
          location: row.location,
          accountablePerson: row.acct_person
        }));
        setItems(mapped);
        setError(null);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

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