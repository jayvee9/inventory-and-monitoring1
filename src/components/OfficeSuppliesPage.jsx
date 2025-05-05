import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import RequestSupplyForm from './RequestSupplyForm';
import OfficeSuppliesSubCategory from './OfficeSuppliesSubCategory';
import './OfficeSuppliesPage.css';

// Initialize Supabase client
const supabaseUrl = 'https://xhmomrolqwicnzayewky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobW9tcm9scXdpY256YXlld2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTQ2NDksImV4cCI6MjA1ODYzMDY0OX0.52keJ2RWDgjKLxHwbq272NsWqNPohHhTxOpi4zqkJbY';
const supabase = createClient(supabaseUrl, supabaseKey);

function OfficeSuppliesPage() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ show: false, type: '', message: '' });

  const fetchSupplies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('officesuppliesinventory')
        .select('*')
        .order('item_specifications', { ascending: true });

      if (error) throw error;
      
      setSupplies(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching supplies:', err);
      setError('Failed to load supplies data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (requestData) => {
    try {
      setLoading(true);
      
      // Format the data to match Supabase table columns
      const formattedData = {
        item_specifications: requestData.itemSpecifications,
        unit_of_measure: requestData.unitOfMeasure,
        beginning_balance_20260201: requestData.beginningBalance,
        purchases_for_month: requestData.purchasesForMonth,
        total_balance: requestData.totalBalance,
        adjustment: requestData.adjustment,
        examination: requestData.examination,
        lrd: requestData.lrd,
        application: requestData.application,
        regulation: requestData.regulation,
        registration: requestData.registration,
        admin: requestData.admin,
        ord: requestData.ord,
        valencia: requestData.valencia,
        iligan: requestData.iligan,
        total_releases: requestData.totalReleases,
        ending_balance_20260228: requestData.endingBalance,
        unit_cost: requestData.unitCost,
        total_amount: requestData.totalAmount,
        ps_dbm_price: requestData.psPriceDBM,
        outside_ps_price: requestData.outsidePSPrice
      };
      
      const { data, error } = await supabase
        .from('officesuppliesinventory')
        .insert([formattedData])
        .select();
      
      if (error) throw error;
      
      setShowRequestForm(false);
      setStatusMessage({
        show: true,
        type: 'success',
        message: 'Supply item added successfully!'
      });
      
      // Refresh the supplies list
      await fetchSupplies();
    } catch (err) {
      console.error('Error adding supply item:', err);
      setStatusMessage({
        show: true,
        type: 'error',
        message: 'Failed to add supply item: ' + err.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const renderSuppliesTable = () => {
    if (loading) {
      return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr className="header-groups">
              <th colSpan="21" className="header-group supplies">Office Supplies Inventory</th>
            </tr>
            <tr>
              <th>Item & Specifications</th>
              <th>Unit of Measure</th>
              <th>Beginning Balance (02/01/2026)</th>
              <th>Purchases for the Month</th>
              <th>Total Balance</th>
              <th>Adjustment</th>
              <th>Examination</th>
              <th>LRD</th>
              <th>Application</th>
              <th>Regulation</th>
              <th>Registration</th>
              <th>Admin</th>
              <th>ORD</th>
              <th>Valencia</th>
              <th>Iligan</th>
              <th>Total Releases</th>
              <th>Ending Balance (02/28/2026)</th>
              <th>Unit Cost</th>
              <th>Total Amount</th>
              <th>PS/DBM Price</th>
              <th>Outside PS Price</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((item, index) => (
              <tr key={index}>
                <td>{item.item_specifications || '-'}</td>
                <td>{item.unit_of_measure || '-'}</td>
                <td>{item.beginning_balance_20260201 || '-'}</td>
                <td>{item.purchases_for_month || '-'}</td>
                <td>{item.total_balance || '-'}</td>
                <td>{item.adjustment || '-'}</td>
                <td>{item.examination || '-'}</td>
                <td>{item.lrd || '-'}</td>
                <td>{item.application || '-'}</td>
                <td>{item.regulation || '-'}</td>
                <td>{item.registration || '-'}</td>
                <td>{item.admin || '-'}</td>
                <td>{item.ord || '-'}</td>
                <td>{item.valencia || '-'}</td>
                <td>{item.iligan || '-'}</td>
                <td>{item.total_releases || '-'}</td>
                <td>{item.ending_balance_20260228 || '-'}</td>
                <td>{item.unit_cost ? `₱${item.unit_cost.toFixed(2)}` : '-'}</td>
                <td>{item.total_amount ? `₱${item.total_amount.toFixed(2)}` : '-'}</td>
                <td>{item.ps_dbm_price ? `₱${item.ps_dbm_price.toFixed(2)}` : '-'}</td>
                <td>{item.outside_ps_price ? `₱${item.outside_ps_price.toFixed(2)}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="office-supplies-page">
      <div className="page-header">
        <h1>Office Supplies Inventory</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowRequestForm(true)}
          disabled={loading}
        >
          {loading ? 'Loading...' : '+ Add New Item'}
        </button>
      </div>

      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RequestSupplyForm 
              onSubmit={handleRequestSubmit}
              onCancel={() => setShowRequestForm(false)}
              loading={loading}
            />
          </div>
        </div>
      )}

      {statusMessage.show && (
        <div className={`status-message ${statusMessage.type}`}>
          <span className="status-message-icon">
            {statusMessage.type === 'success' ? '✓' : '⚠'}
          </span>
          <div className="status-message-content">
            {statusMessage.message}
          </div>
          <button 
            className="status-message-close"
            onClick={() => setStatusMessage(prev => ({ ...prev, show: false }))}
          >
            ×
          </button>
        </div>
      )}

      {/* Sub-category table - pass the supplies data */}
      <OfficeSuppliesSubCategory items={supplies} />

      {/* Main supplies table */}
      <div className="inventory-list-container">
        {renderSuppliesTable()}
      </div>
    </div>
  );
}

export default OfficeSuppliesPage;