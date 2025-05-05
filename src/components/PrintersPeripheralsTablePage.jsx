import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import './PrintersPeripheralsPage.css';

function PrintersPeripheralsTablePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('printers_peripherals').select('*');
        if (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
        setItems(data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        setItems([]);
      } finally {
        setLoading(false);
      }
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