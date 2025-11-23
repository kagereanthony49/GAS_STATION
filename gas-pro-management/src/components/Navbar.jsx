// src/components/Navbar.jsx

import React from 'react';
import '../styles/Navbar.css'
import pumpIcon from '../assets/gas-pump.svg'

const Navbar = ({ title, actions = [], showLogout, onLogout }) => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-title">
          <h1>{title}</h1>
        </div>
        {actions?.length > 0 && (
          <nav className="navbar-actions">
            {actions.map(a => (
              <button key={a.label} className="navbar-action" onClick={a.onClick}>{a.label}</button>
            ))}
          </nav>
        )}
        {showLogout && (
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
      <div className="navbar-right">
        <img src={pumpIcon} alt="Gas Pump" className="navbar-icon" />
      </div>
    </header>
  );
};

export default Navbar;