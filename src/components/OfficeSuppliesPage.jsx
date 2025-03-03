import React, { useState, useEffect } from 'react';
import { sheetService } from '../services/sheetService';
import RequestSupplyForm from './RequestSupplyForm';
import './OfficeSuppliesPage.css';

function OfficeSuppliesPage() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ show: false, type: '', message: '' });

  const fetchSupplies = async () => {
    try {
      setLoading(true);
      const data = await sheetService.getAllItems('SUPPLIES');
      setSupplies(data);
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
      
      // Format the data to match the new sheet column names
      const formattedData = {
        'Item & Specifications': requestData.itemSpecifications,
        'Unit of Measure': requestData.unitOfMeasure,
        'Beginning Balance as of 02/01/2025': requestData.beginningBalance,
        'Purchases for the Month': requestData.purchasesForMonth,
        'Total Balance': requestData.totalBalance,
        'Adjustment': requestData.adjustment,
        'Examination': requestData.examination,
        'LRD': requestData.lrd,
        'Application': requestData.application,
        'Regulation': requestData.regulation,
        'Registration': requestData.registration,
        'Admin': requestData.admin,
        'ORD': requestData.ord,
        'Valencia': requestData.valencia,
        'Iligan': requestData.iligan,
        'Total Releases': requestData.totalReleases,
        'Ending Balance as of 02/28/2025': requestData.endingBalance,
        'Unit Cost': requestData.unitCost,
        'Total Amount': requestData.totalAmount,
        'PS/DBM Price': requestData.psPriceDBM,
        'Outside PS Price': requestData.outsidePSPrice
      };
      
      const response = await sheetService.addItem(formattedData, 'SUPPLIES');
      
      if (response) {
        setShowRequestForm(false);
        setStatusMessage({
          show: true,
          type: 'success',
          message: 'Supply item added successfully!'
        });
        
        // Refresh the supplies list
        await fetchSupplies();
      }
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
              <th>Beginning Balance as of 02/01/2025</th>
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
              <th>Ending Balance as of 02/28/2025</th>
              <th>Unit Cost</th>
              <th>Total Amount</th>
              <th>PS/DBM Price</th>
              <th>Outside PS Price</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((item, index) => (
              <tr key={index}>
                <td>{item.itemSpecifications || '-'}</td>
                <td>{item.unitOfMeasure || '-'}</td>
                <td>{item.beginningBalance || '-'}</td>
                <td>{item.purchasesForMonth || '-'}</td>
                <td>{item.totalBalance || '-'}</td>
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
                <td>{item.totalReleases || '-'}</td>
                <td>{item.endingBalance || '-'}</td>
                <td>{item.unitCost || '-'}</td>
                <td>{item.totalAmount || '-'}</td>
                <td>{item.psPriceDBM || '-'}</td>
                <td>{item.outsidePSPrice || '-'}</td>
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
        >
          + Add New Item
        </button>
      </div>

      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RequestSupplyForm 
              onSubmit={handleRequestSubmit}
              onCancel={() => setShowRequestForm(false)}
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

      <div className="inventory-list-container">
        {renderSuppliesTable()}
      </div>
    </div>
  );
}

export default OfficeSuppliesPage; 