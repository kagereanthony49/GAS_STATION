import React, { useState } from 'react'
import { useAppStore } from '../store/hooks.js'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { login } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async () => {
    try {
      const user = await login(email, password)
      if (user?.role === 'admin') navigate('/admin')
      else navigate('/employee')
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: 420 }}>
        <h2 style={{ color: 'var(--primary-color)' }}>Login</h2>
        {error && <div style={{ color: '#dc3545' }}>{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: '0.6rem' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '0.6rem' }} />
        <button onClick={submit}>Login</button>
      </div>
    </div>
  )
}

export default Login