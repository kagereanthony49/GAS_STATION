import React from 'react'
import { useAppStore } from '../store/hooks.js'
import '../styles/AdminDashboard.css'

const SalesChart = () => {
  const { reports, fuelPrices } = useAppStore()
  const today = new Date().toISOString().slice(0, 10)
  const totals = { pms: 0, ago: 0, bik: 0 }
  reports.filter(r => r.timestamp?.slice(0, 10) === today).forEach(r => {
    const m = r.meterReadings || {}
    const add = (t) => {
      const m1 = parseFloat(m?.[t]?.m1 || 0)
      const m2 = parseFloat(m?.[t]?.m2 || 0)
      if (m2 > m1) totals[t] += m2 - m1
    }
    add('pms'); add('ago'); add('bik')
  })
  const maxLitres = Math.max(1, totals.pms, totals.ago, totals.bik)
  const bar = (val, color, label) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
      <div style={{ width: '120px' }}>{label}</div>
      <div style={{ background: color, height: '24px', width: `${(val / maxLitres) * 300}px`, borderRadius: '6px' }} />
      <div style={{ minWidth: '80px', textAlign: 'right' }}>{val.toFixed(2)} L</div>
    </div>
  )
  return (
    <div className="card">
      <h2 style={{ color: 'var(--primary-color)' }}>Daily Fuel Sales</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {bar(totals.pms, '#007bff', 'PMS')}
        {bar(totals.ago, '#17a2b8', 'AGO')}
        {bar(totals.bik, '#28a745', 'BIK')}
      </div>
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="card"><strong>PMS</strong><div>UGX {fuelPrices.pms.toLocaleString()} / L</div></div>
        <div className="card"><strong>AGO</strong><div>UGX {fuelPrices.ago.toLocaleString()} / L</div></div>
        <div className="card"><strong>BIK</strong><div>UGX {fuelPrices.bik.toLocaleString()} / L</div></div>
      </div>
    </div>
  )
}

export default SalesChart