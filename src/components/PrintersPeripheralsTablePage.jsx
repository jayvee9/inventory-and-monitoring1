import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './PrintersPeripheralsPage.css';

const supabaseUrl = 'https://xhmomrolqwicnzayewky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobW9tcm9scXdpY256YXlld2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTQ2NDksImV4cCI6MjA1ODYzMDY0OX0.52keJ2RWDgjKLxHwbq272NsWqNPohHhTxOpi4zqkJbY';
const supabase = createClient(supabaseUrl, supabaseKey);

function PrintersPeripheralsTablePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('printers_peripherals').select('*');
      if (error) {
        setError('Failed to fetch data');
        setItems([]);
      } else {
        setItems(data);
        setError(null);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="printers-peripherals-table-page">
      <h2>Printers & Peripherals Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Serial No.</th>
            <th>Property No.</th>
            <th>Brand/Model</th>
            <th>Unit Cost</th>
            <th>Date</th>
            <th>Acct. Person</th>
            <th>Status</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.type || '-'}</td>
              <td>{item.serial_no || '-'}</td>
              <td>{item.property_no || '-'}</td>
              <td>{item.brand_model || '-'}</td>
              <td>{item.unit_cost || '-'}</td>
              <td>{item.date || '-'}</td>
              <td>{item.acct_person || '-'}</td>
              <td>{item.status || '-'}</td>
              <td>{item.location || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrintersPeripheralsTablePage; 