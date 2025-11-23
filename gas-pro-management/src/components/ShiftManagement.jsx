import React from 'react'
import { useAppStore } from '../store/hooks.js'

const ShiftManagement = () => {
  const { employees, shifts, moveEmployeeToShift } = useAppStore()
  const empById = Object.fromEntries(employees.map(e => [e.id, e]))
  const renderList = (ids, label) => (
    <div className="card" style={{ flex: 1 }}>
      <h3 style={{ color: 'var(--primary-color)', marginTop: 0 }}>{label}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {ids.map(id => (
          <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <img src={empById[id]?.image || ''} alt="" style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0f0f0', objectFit: 'cover' }} />
              <span>{empById[id]?.name || id}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={() => moveEmployeeToShift(id, 'day')}>To Day</button>
              <button onClick={() => moveEmployeeToShift(id, 'night')}>To Night</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {renderList(shifts.day, 'Day Shift')}
      {renderList(shifts.night, 'Night Shift')}
    </div>
  )
}

export default ShiftManagement