// src/App.jsx

import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './styles/Home.css'

// Import the dashboard pages we created earlier
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Login from './pages/Login';
// import { useAppStore } from './store/hooks.js'

// A simple component for the home page to allow navigation
function HomePage() {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-card">
          <h1 className="home-title">GAS PRO Management System</h1>
          <div className="home-sub">Manage fuel prices, shifts, reports and daily operations.</div>
          <div className="home-actions">
            <Link className="home-link" to="/login">Login</Link>
            <Link className="home-link" to="/admin">Admin Dashboard</Link>
            <Link className="home-link" to="/employee">Employee Dashboard</Link>
          </div>
        </div>
      </div>
      <footer className="home-footer">&copy; 2025 GAS PRO. | <a style={{ color: '#fff' }} href="mailto:gasproadmin@gmail.com">gasproadmin@gmail.com</a></footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;