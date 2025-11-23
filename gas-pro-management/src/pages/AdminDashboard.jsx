// src/pages/AdminDashboard.jsx

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ChangePrices from '../components/ChangePrices'
import ReportsView from '../components/ReportsView'
import ShiftManagement from '../components/ShiftManagement'
import SalesChart from '../components/SalesChart'
import '../styles/AdminDashboard.css'
import { useAppStore } from '../store/hooks.js'
import { useNavigate } from 'react-router-dom'


const AdminDashboard = () => {
  const { fuelPrices, setFuelPrice, logout } = useAppStore()
  const navigate = useNavigate()
  
  const handlePriceChange = (fuelType, newPrice) => {
    setFuelPrice(fuelType, newPrice)
  };

  const [activeSection, setActiveSection] = useState('overview')

  return (
    <div className="admin-dashboard">
      <Navbar title="GAS PRO ADMIN" actions={[
        { label: 'CHANGE PRICES', onClick: () => setActiveSection('prices') },
        { label: 'REPORTS', onClick: () => setActiveSection('reports') },
        { label: 'EMPLOYEE SHIFT', onClick: () => setActiveSection('shifts') },
        { label: 'Logout', onClick: () => { logout(); navigate('/login') } },
      ]} />
      <div className="dashboard-main-content">
        <Sidebar onNavigate={(action) => {
          if (action === 'View Reports') setActiveSection('reports')
          if (action === 'Quick Actions') setActiveSection('announcements')
          if (action === 'Add New Employee') setActiveSection('addEmployee')
          if (action === 'Edit Employee Credentials') setActiveSection('editEmployee')
        }} />
        <div className="dashboard-body">
          <h1 className="welcome-header">Administrator Dashboard</h1>
          
          {activeSection === 'overview' && (
            <>
              <div className="main-sections">
                <ChangePrices prices={fuelPrices} onPriceChange={handlePriceChange} />
                <SalesChart />
              </div>
              <div className="secondary-sections">
                <ShiftManagement />
                <ReportsView />
              </div>
            </>
          )}

          {activeSection === 'prices' && (
            <div className="main-sections">
              <ChangePrices prices={fuelPrices} onPriceChange={handlePriceChange} />
            </div>
          )}

          {activeSection === 'reports' && (
            <div className="main-sections">
              <ReportsView />
            </div>
          )}

          {activeSection === 'shifts' && (
            <div className="main-sections">
              <ShiftManagement />
            </div>
          )}

          {activeSection === 'addEmployee' && (
            <div className="card" style={{ maxWidth: 600 }}>
              <h2 style={{ color: 'var(--primary-color)' }}>Add New Employee</h2>
              <AddEmployeeForm />
            </div>
          )}

          {activeSection === 'editEmployee' && (
            <div className="card" style={{ maxWidth: 700 }}>
              <h2 style={{ color: 'var(--primary-color)' }}>Edit Employee Credentials</h2>
              <EditEmployeePanel />
            </div>
          )}

          {activeSection === 'announcements' && (
            <div className="card" style={{ maxWidth: 700 }}>
              <h2 style={{ color: 'var(--primary-color)' }}>Quick Actions</h2>
              <AnnouncementsPanel />
            </div>
          )}
        </div>
      </div>
       <footer className="dashboard-footer">
        &copy; 2025 GAS PRO. All rights reserved. | <a href="mailto:gasproadmin@gmail.com">gasproadmin@gmail.com</a>
      </footer>
    </div>
  );
};

export default AdminDashboard;

const AddEmployeeForm = () => {
  const { addEmployee } = useAppStore()
  const [form, setForm] = React.useState({ name: '', phone: '', image: '', signature: '' })
  const handleFile = async (key, file) => {
    if (!file) return
    const b = await file.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(b)))
    const dataUrl = `data:${file.type};base64,${base64}`
    setForm(prev => ({ ...prev, [key]: dataUrl }))
  }
  const submit = () => {
    if (!form.name || !form.phone) return
    addEmployee(form)
    setForm({ name: '', phone: '', image: '', signature: '' })
  }
  return (
    <div style={{ display: 'grid', gap: '0.6rem' }}>
      <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <input type="file" accept="image/*" onChange={e => handleFile('image', e.target.files?.[0])} />
        <input type="file" accept="image/*" onChange={e => handleFile('signature', e.target.files?.[0])} />
      </div>
      <button onClick={submit}>Add Employee</button>
    </div>
  )
}

const EditEmployeePanel = () => {
  const { employees, dismissEmployee, updateEmployee } = useAppStore()
  const [selectedId, setSelectedId] = React.useState(employees[0]?.id || '')
  const [field, setField] = React.useState('name')
  const [value, setValue] = React.useState('')
  const dismiss = () => {
    if (selectedId) dismissEmployee(selectedId)
  }
  const update = async () => {
    if (!selectedId) return
    if (field === 'image' || field === 'signature') return
    updateEmployee(selectedId, { [field]: value })
    setValue('')
  }
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <button onClick={dismiss}>Dismiss</button>
      </div>
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
        <select value={field} onChange={e => setField(e.target.value)}>
          <option value="name">name</option>
          <option value="phone">phone</option>
        </select>
        <input type="text" placeholder="new value" value={value} onChange={e => setValue(e.target.value)} />
        <button onClick={update}>Update</button>
      </div>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <label>Update image</label>
        <input type="file" accept="image/*" onChange={async e => {
          const f = e.target.files?.[0]; if (!f) return
          const b = await f.arrayBuffer(); const base64 = btoa(String.fromCharCode(...new Uint8Array(b)))
          const dataUrl = `data:${f.type};base64,${base64}`
          updateEmployee(selectedId, { image: dataUrl })
        }} />
      </div>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <label>Update signature</label>
        <input type="file" accept="image/*" onChange={async e => {
          const f = e.target.files?.[0]; if (!f) return
          const b = await f.arrayBuffer(); const base64 = btoa(String.fromCharCode(...new Uint8Array(b)))
          const dataUrl = `data:${f.type};base64,${base64}`
          updateEmployee(selectedId, { signature: dataUrl })
        }} />
      </div>
    </div>
  )
}

const AnnouncementsPanel = () => {
  const { announcements, addAnnouncement } = useAppStore()
  const [msg, setMsg] = React.useState('')
  const send = () => {
    if (!msg) return
    addAnnouncement(msg)
    setMsg('')
  }
  return (
    <div style={{ display: 'grid', gap: '0.8rem' }}>
      <textarea rows={3} placeholder="Announcement message" value={msg} onChange={e => setMsg(e.target.value)} />
      <button onClick={send}>Send Announcement</button>
      <div>
        <h4 style={{ color: 'var(--primary-color)' }}>Latest</h4>
        {announcements.map(a => (
          <div key={a.id} style={{ borderTop: '1px solid #eee', paddingTop: '0.4rem' }}>
            <div style={{ fontWeight: 'bold' }}>{new Date(a.timestamp).toLocaleString()}</div>
            <div>{a.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}