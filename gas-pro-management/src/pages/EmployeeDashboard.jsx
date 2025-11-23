// src/pages/EmployeeDashboard.jsx

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FuelCard from '../components/FuelCard';
import MobileMoneyForm from '../components/MobileMoneyForm';
import GrandTotal from '../components/GrandTotal';
import '../styles/EmployeeDashboard.css';
import { useAppStore } from '../store/hooks.js';

// In a real app, these prices would come from your backend/API
// and update in real-time via Socket.IO

const EmployeeDashboard = () => {
  // State for meter readings
  const [meterReadings, setMeterReadings] = useState({
    pms: { m1: '', m2: '' },
    ago: { m1: '', m2: '' },
    bik: { m1: '', m2: '' },
  });
  
  // State for mobile money payments
  const [mobilePayments, setMobilePayments] = useState([]);
  
  const { fuelPrices, reports, announcements, logout } = useAppStore()

  const [employeeInfo, setEmployeeInfo] = useState({ name: '', image: '' })

  // TODO: Add a useEffect hook here to listen for price changes via Socket.IO
  // useEffect(() => {
  //   const socket = io("http://your-backend-server.com");
  //   socket.on('priceUpdate', (updatedPrices) => {
  //     setFuelPrices(updatedPrices);
  //   });
  //   return () => socket.disconnect();
  // }, []);


  const handleMeterChange = (fuelType, meter, value) => {
    setMeterReadings(prev => ({
      ...prev,
      [fuelType]: { ...prev[fuelType], [meter]: value },
    }));
  };
  
  const handleAddMobilePayment = (payment) => {
    setMobilePayments([...mobilePayments, payment]);
  };

  const handleClear = () => {
    setMeterReadings({
      pms: { m1: '', m2: '' },
      ago: { m1: '', m2: '' },
      bik: { m1: '', m2: '' },
    });
    setMobilePayments([]);
  };
  
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleGenerateAndSubmitReport = () => {
    alert('Report has been submitted')
  }

  return (
    <div className="employee-dashboard">
      <Navbar title="GAS PRO EMPLOYEE" showLogout={true} onLogout={handleLogout} />
      <div className="employee-header">
        <h2>Enter your meter readings here for computation</h2>
        <button className="clear-button" onClick={handleClear}>Clear All</button>
      </div>

      <div className="card" style={{ margin: '1rem 2rem' }}>
        <h3 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Announcements</h3>
        {announcements.length === 0 ? (
          <div>No announcements.</div>
        ) : (
          announcements.slice(0, 3).map(a => (
            <div key={a.id} style={{ borderTop: '1px solid #eee', paddingTop: '0.4rem' }}>
              <div style={{ fontWeight: 'bold' }}>{new Date(a.timestamp).toLocaleString()}</div>
              <div>{a.message}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0 2rem' }}>
        <input type="text" placeholder="Employee name" value={employeeInfo.name} onChange={e => setEmployeeInfo({ ...employeeInfo, name: e.target.value })} />
        <input type="file" accept="image/*" onChange={async e => {
          const file = e.target.files?.[0]
          if (!file) return
          const b = await file.arrayBuffer()
          const base64 = btoa(String.fromCharCode(...new Uint8Array(b)))
          const dataUrl = `data:${file.type};base64,${base64}`
          setEmployeeInfo(prev => ({ ...prev, image: dataUrl }))
        }} />
      </div>

      <div className="fuel-cards-container">
        <FuelCard 
          fuelType="PMS (PETROL)" 
          readings={meterReadings.pms}
          pricePerLitre={fuelPrices.pms}
          onMeterChange={(meter, value) => handleMeterChange('pms', meter, value)}
        />
        <FuelCard 
          fuelType="AGO (DIESEL)"
          readings={meterReadings.ago}
          pricePerLitre={fuelPrices.ago}
          onMeterChange={(meter, value) => handleMeterChange('ago', meter, value)}
        />
        <FuelCard 
          fuelType="BIK (KEROSENE)"
          readings={meterReadings.bik}
          pricePerLitre={fuelPrices.bik}
          onMeterChange={(meter, value) => handleMeterChange('bik', meter, value)}
        />
      </div>

      <MobileMoneyForm onAddPayment={handleAddMobilePayment} payments={mobilePayments} />
      
      <GrandTotal 
        meterReadings={meterReadings}
        fuelPrices={fuelPrices}
        mobilePayments={mobilePayments}
        employeeInfo={employeeInfo}
        onSubmitReport={handleGenerateAndSubmitReport}
      />

      <div className="card" style={{ margin: '0 2rem' }}>
        <h3 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Your Last Report</h3>
        {reports.filter(r => r.employee?.name === employeeInfo.name)[0] ? (
          <div>
            <div>{new Date(reports.filter(r => r.employee?.name === employeeInfo.name)[0].timestamp).toLocaleString()}</div>
            <div>Grand Total: UGX {reports.filter(r => r.employee?.name === employeeInfo.name)[0].totals?.grand?.toLocaleString?.() || '0'}</div>
          </div>
        ) : (
          <div>No report yet.</div>
        )}
      </div>

      <footer className="dashboard-footer">
        &copy; 2025 GAS PRO. All rights reserved. | <a href="mailto:gasproadmin@gmail.com">gasproadmin@gmail.com</a>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;
