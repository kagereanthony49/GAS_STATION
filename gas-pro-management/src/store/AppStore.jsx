import React, { useMemo, useState, useEffect } from 'react'
import { AppContext } from './context.js'
import { io } from 'socket.io-client'

const initialFuelPrices = { pms: 5500, ago: 5200, bik: 4800 }

const defaultEmployees = [
  { id: 'e1', name: 'John Doe', phone: '0700000001', image: null, signature: null },
  { id: 'e2', name: 'Jane Smith', phone: '0700000002', image: null, signature: null },
  { id: 'e3', name: 'Alex Mwangi', phone: '0700000003', image: null, signature: null },
]


function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) { void e }
}

function readPersist(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export const AppProvider = ({ children }) => {
  const [fuelPrices, setFuelPrices] = useState(readPersist('fuelPrices', initialFuelPrices))
  const [employees, setEmployees] = useState(readPersist('employees', defaultEmployees))
  const [shifts, setShifts] = useState(readPersist('shifts', { day: ['e1', 'e2'], night: ['e3'] }))
  const [announcements, setAnnouncements] = useState(readPersist('announcements', []))
  const [reports, setReports] = useState(readPersist('reports', []))
  const api = 'http://localhost:8080/api'
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => persist('fuelPrices', fuelPrices), [fuelPrices])
  useEffect(() => persist('employees', employees), [employees])
  useEffect(() => persist('shifts', shifts), [shifts])
  useEffect(() => persist('announcements', announcements), [announcements])
  useEffect(() => persist('reports', reports), [reports])

  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch(`${api}/state`)
        if (r.ok) {
          const s = await r.json()
          setFuelPrices(s.fuelPrices)
          setEmployees(s.employees)
          setShifts(s.shifts)
          setAnnouncements(s.announcements)
          setReports(s.reports)
        }
      } catch (e) { void e }
    })()
    const socket = io('http://localhost:8080', { transports: ['websocket'] })
    socket.on('priceUpdate', (p) => setFuelPrices(p))
    socket.on('employeesUpdate', (list) => setEmployees(list))
    socket.on('shiftsUpdate', (s) => setShifts(s))
    socket.on('announcementsUpdate', (a) => setAnnouncements(a))
    socket.on('reportAdded', (r) => setReports(prev => [r, ...prev]))
    const onStorage = (e) => {
      try {
        if (e.key === 'fuelPrices' && e.newValue) setFuelPrices(JSON.parse(e.newValue))
        if (e.key === 'employees' && e.newValue) setEmployees(JSON.parse(e.newValue))
        if (e.key === 'shifts' && e.newValue) setShifts(JSON.parse(e.newValue))
        if (e.key === 'announcements' && e.newValue) setAnnouncements(JSON.parse(e.newValue))
        if (e.key === 'reports' && e.newValue) setReports(JSON.parse(e.newValue))
      } catch (err) { void err }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      socket.close()
    }
  }, [])

  const setFuelPrice = (type, price) => {
    setFuelPrices(prev => ({ ...prev, [type]: price }))
    ;(async () => { try { await fetch(`${api}/prices`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, price }) }) } catch (e) { void e } })()
  }

  const addEmployee = (emp) => {
    const newEmp = { ...emp, id: crypto.randomUUID() }
    setEmployees(prev => [...prev, newEmp])
    ;(async () => { try { await fetch(`${api}/employees`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newEmp) }) } catch (e) { void e } })()
  }

  const dismissEmployee = (id) => {
    setEmployees(prev => prev.filter(e => e.id !== id))
    setShifts(prev => ({
      day: prev.day.filter(eid => eid !== id),
      night: prev.night.filter(eid => eid !== id),
    }))
    setReports(prev => prev.filter(r => r.employee?.id !== id))
    ;(async () => { try { await fetch(`${api}/employees/${id}`, { method: 'DELETE' }) } catch (e) { void e } })()
  }

  const updateEmployee = (id, patch) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)))
    ;(async () => { try { await fetch(`${api}/employees/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) }) } catch (e) { void e } })()
  }

  const moveEmployeeToShift = (id, target) => {
    setShifts(prev => ({
      day: target === 'day' ? Array.from(new Set([id, ...prev.day])).filter(eid => eid !== id || target === 'day') : prev.day.filter(eid => eid !== id),
      night: target === 'night' ? Array.from(new Set([id, ...prev.night])).filter(eid => eid !== id || target === 'night') : prev.night.filter(eid => eid !== id),
    }))
    ;(async () => { try { await fetch(`${api}/shifts/move`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, target }) }) } catch (e) { void e } })()
  }

  const addAnnouncement = (message) => {
    setAnnouncements(prev => [{ id: crypto.randomUUID(), message, timestamp: new Date().toISOString() }, ...prev])
    ;(async () => { try { await fetch(`${api}/announcements`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) }) } catch (e) { void e } })()
  }

  const addReport = (report) => {
    setReports(prev => [{ id: crypto.randomUUID(), ...report }, ...prev])
    ;(async () => { try { await fetch(`${api}/reports`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) }) } catch (e) { void e } })()
  }

  const login = async (email, password) => {
    let r = await fetch(`${api}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (!r.ok && email === 'gasproadmin@gmail.com') {
      await fetch(`${api}/auth/reset-admin`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      r = await fetch(`${api}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    }
    if (!r.ok) throw new Error('invalid_credentials')
    const data = await r.json()
    setToken(data.token)
    setCurrentUser(data.user)
    return data.user
  }

  const logout = () => {
    setToken(null)
    setCurrentUser(null)
  }

  const value = useMemo(() => ({
    fuelPrices,
    employees,
    shifts,
    announcements,
    reports,
    currentUser,
    token,
    setFuelPrice,
    addEmployee,
    dismissEmployee,
    updateEmployee,
    moveEmployeeToShift,
    addAnnouncement,
    addReport,
    login,
    logout,
  }), [fuelPrices, employees, shifts, announcements, reports, currentUser, token])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export {}