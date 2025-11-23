import React from 'react'
import { useAppStore } from '../store/hooks.js'

const ReportsView = () => {
  const { reports } = useAppStore()
  return (
    <div className="card">
      <h2 style={{ color: 'var(--primary-color)' }}>Reports</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reports.length === 0 && <div>No reports submitted yet.</div>}
        {reports.map(r => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.8rem' }}>
            <img src={r.employee?.image || ''} alt="Employee" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', background: '#f0f0f0' }} />
            <div>
              <div><strong>{r.employee?.name || 'Unknown'}</strong></div>
              <div>{new Date(r.timestamp).toLocaleString()}</div>
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <div>PMS: {(parseFloat(r.meterReadings?.pms?.m2 || 0) - parseFloat(r.meterReadings?.pms?.m1 || 0)) > 0 ? (parseFloat(r.meterReadings?.pms?.m2 || 0) - parseFloat(r.meterReadings?.pms?.m1 || 0)).toFixed(2) : '0'} L</div>
              <div>AGO: {(parseFloat(r.meterReadings?.ago?.m2 || 0) - parseFloat(r.meterReadings?.ago?.m1 || 0)) > 0 ? (parseFloat(r.meterReadings?.ago?.m2 || 0) - parseFloat(r.meterReadings?.ago?.m1 || 0)).toFixed(2) : '0'} L</div>
              <div>BIK: {(parseFloat(r.meterReadings?.bik?.m2 || 0) - parseFloat(r.meterReadings?.bik?.m1 || 0)) > 0 ? (parseFloat(r.meterReadings?.bik?.m2 || 0) - parseFloat(r.meterReadings?.bik?.m1 || 0)).toFixed(2) : '0'} L</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportsView