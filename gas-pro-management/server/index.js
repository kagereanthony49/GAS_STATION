import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import { Server } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

const dataDir = path.join(__dirname, 'data')
const dbFile = path.join(dataDir, 'db.json')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({
  fuelPrices: { pms: 5500, ago: 5200, bik: 4800 },
  employees: [
    { id: 'e1', name: 'John Doe', phone: '0700000001', image: null, signature: null },
    { id: 'e2', name: 'Jane Smith', phone: '0700000002', image: null, signature: null },
    { id: 'e3', name: 'Alex Mwangi', phone: '0700000003', image: null, signature: null },
  ],
  shifts: { day: ['e1', 'e2'], night: ['e3'] },
  announcements: [],
  reports: [],
}, null, 2))

const readDb = () => JSON.parse(fs.readFileSync(dbFile, 'utf8'))
const writeDb = (d) => fs.writeFileSync(dbFile, JSON.stringify(d, null, 2))
const sessions = {}

app.get('/api/state', (req, res) => { res.json(readDb()) })

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const db = readDb()
  const user = (db.users || []).find(u => u.email === email)
  if (!user) return res.status(401).json({ error: 'invalid_credentials' })
  const ok = bcrypt.compareSync(password || '', user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' })
  const token = `${Date.now()}_${Math.random().toString(36).slice(2)}`
  sessions[token] = { id: user.id, email: user.email, role: user.role, name: user.name }
  res.json({ token, user: sessions[token] })
})

app.post('/api/auth/reset-admin', (req, res) => {
  const { password } = req.body || {}
  const db = readDb()
  if (!db.users) db.users = []
  let user = db.users.find(u => u.email === 'gasproadmin@gmail.com')
  const hash = bcrypt.hashSync((password || 'admin@2025'), 10)
  if (!user) {
    user = { id: 'u_admin', email: 'gasproadmin@gmail.com', name: 'Admin', role: 'admin', passwordHash: hash }
    db.users.push(user)
  } else {
    user.passwordHash = hash
  }
  writeDb(db)
  res.json({ ok: true })
})

app.patch('/api/prices', (req, res) => {
  const { type, price } = req.body || {}
  const db = readDb()
  if (!['pms', 'ago', 'bik'].includes(type) || !price) return res.status(400).json({ error: 'bad_request' })
  db.fuelPrices[type] = price
  writeDb(db)
  res.json({ ok: true })
  broadcast('priceUpdate', db.fuelPrices)
})

app.post('/api/reports', (req, res) => {
  const report = req.body || {}
  report.id = report.id || `${Date.now()}`
  report.timestamp = report.timestamp || new Date().toISOString()
  const db = readDb()
  db.reports.unshift(report)
  writeDb(db)
  res.json({ ok: true, id: report.id })
  broadcast('reportAdded', report)
})

app.post('/api/announcements', (req, res) => {
  const { message } = req.body || {}
  if (!message) return res.status(400).json({ error: 'bad_request' })
  const db = readDb()
  db.announcements.unshift({ id: `${Date.now()}`, message, timestamp: new Date().toISOString() })
  writeDb(db)
  res.json({ ok: true })
  broadcast('announcementsUpdate', db.announcements)
})

app.post('/api/employees', (req, res) => {
  const emp = req.body || {}
  emp.id = emp.id || `e_${Date.now()}`
  const db = readDb()
  db.employees.push(emp)
  writeDb(db)
  res.json({ ok: true, id: emp.id })
  broadcast('employeesUpdate', db.employees)
})

app.patch('/api/employees/:id', (req, res) => {
  const { id } = req.params
  const patch = req.body || {}
  const db = readDb()
  db.employees = db.employees.map(e => (e.id === id ? { ...e, ...patch } : e))
  writeDb(db)
  res.json({ ok: true })
  broadcast('employeesUpdate', db.employees)
})

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params
  const db = readDb()
  db.employees = db.employees.filter(e => e.id !== id)
  db.shifts.day = db.shifts.day.filter(eid => eid !== id)
  db.shifts.night = db.shifts.night.filter(eid => eid !== id)
  db.reports = db.reports.filter(r => r.employee?.id !== id)
  writeDb(db)
  res.json({ ok: true })
  broadcast('employeesUpdate', db.employees)
})

app.post('/api/shifts/move', (req, res) => {
  const { id, target } = req.body || {}
  if (!['day', 'night'].includes(target)) return res.status(400).json({ error: 'bad_request' })
  const db = readDb()
  db.shifts.day = db.shifts.day.filter(eid => eid !== id)
  db.shifts.night = db.shifts.night.filter(eid => eid !== id)
  db.shifts[target].unshift(id)
  writeDb(db)
  res.json({ ok: true })
  broadcast('shiftsUpdate', db.shifts)
})
const ensureUsersSeed = () => {
  const db = readDb()
  if (!db.users) db.users = []
  const exists = db.users.find(u => u.email === 'gasproadmin@gmail.com')
  if (!exists) {
    const hash = bcrypt.hashSync('admin@2025', 10)
    db.users.push({ id: 'u_admin', email: 'gasproadmin@gmail.com', name: 'Admin', role: 'admin', passwordHash: hash })
  }
  const empExists = db.users.find(u => u.email === 'employee@example.com')
  if (!empExists) {
    const hashEmp = bcrypt.hashSync('employee@2025', 10)
    db.users.push({ id: 'u_emp_demo', email: 'employee@example.com', name: 'Employee Demo', role: 'employee', passwordHash: hashEmp })
  }
  writeDb(db)
}
ensureUsersSeed()

const server = app.listen(8080, () => {
  console.log(`API listening on http://localhost:8080`)
})
const io = new Server(server, { cors: { origin: '*' } })
const broadcast = (event, payload) => io.emit(event, payload)