import React from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import InventoryPage from './components/InventoryPage';
import LaptopsPage from './components/LaptopsPage';
import PrintersPeripheralsPage from './components/PrintersPeripheralsPage';
import OfficeSuppliesPage from './components/OfficeSuppliesPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="prc-header">
          <div className="header-container">
            <div className="logo-section">
              <img src="https://www.prc.gov.ph/sites/default/files/1prc_logo.png" alt="National Emblem" />
            </div>
            <div className="title-section">
              <div className="republic-title">Republic of the Philippines</div>
              <div className="main-title">PROFESSIONAL REGULATION COMMISSION</div>
            </div>
          </div>
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
    </Router>
  );
}

export default App; 