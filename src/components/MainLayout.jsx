import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import InventoryPage from './InventoryPage';
import LaptopsPage from './LaptopsPage';
import PrintersPeripheralsPage from './PrintersPeripheralsPage';
import OfficeSuppliesPage from './OfficeSuppliesPage';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const MainLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="prc-header" style={{ position: 'relative' }}>
        <div className="header-container">
          <div className="logo-section">
            <img src="https://www.prc.gov.ph/sites/default/files/1prc_logo.png" alt="National Emblem" />
          </div>
          <div className="title-section">
            <div className="republic-title">Republic of the Philippines</div>
            <div className="main-title">PROFESSIONAL REGULATION COMMISSION</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: 16,
            right: 24,
            padding: '8px 16px',
            fontSize: '1rem',
            cursor: 'pointer',
            borderRadius: '4px',
            border: 'none',
            background: '#1a365d',
            color: '#fff',
            zIndex: 10
          }}
        >
          Logout
        </button>
        <nav className="nav-container">
          <ul className="nav-menu">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                Computers
              </NavLink>
            </li>
            <li>
              <NavLink to="/laptops" className={({ isActive }) => isActive ? 'active' : ''}>
                Laptops
              </NavLink>
            </li>
            <li>
              <NavLink to="/printers" className={({ isActive }) => isActive ? 'active' : ''}>
                Printers & Peripherals
              </NavLink>
            </li>
            <li>
              <NavLink to="/supplies" className={({ isActive }) => isActive ? 'active' : ''}>
                Office Supplies
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<InventoryPage type="Computers" />} />
        <Route path="/laptops" element={<LaptopsPage />} />
        <Route path="/printers" element={<PrintersPeripheralsPage />} />
        <Route path="/supplies" element={<OfficeSuppliesPage />} />
      </Routes>
    </div>
  );
};

export default MainLayout; 