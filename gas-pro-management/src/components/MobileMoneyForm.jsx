import React, { useState } from 'react'

const networks = ['MTN', 'AIRTEL', 'OTHER']

const MobileMoneyForm = ({ onAddPayment, payments }) => {
  const [network, setNetwork] = useState(networks[0])
  const [amount, setAmount] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const add = () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0 || !transactionId) return
    onAddPayment({ network, amount: amt, transactionId })
    setAmount('')
    setTransactionId('')
  }

  return (
    <div className="card" style={{ margin: '0 2rem' }}>
      <h3 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Mobile Money Payments</h3>
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
        <select value={network} onChange={e => setNetwork(e.target.value)}>
          {networks.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <input type="number" placeholder="amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <input type="text" placeholder="transaction id" value={transactionId} onChange={e => setTransactionId(e.target.value)} />
        <button onClick={add}>+ADD</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontWeight: 'bold' }}>
          <div>network</div><div>amount</div><div>transaction id</div>
        </div>
        {payments.map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #eee', paddingTop: '0.4rem' }}>
            <div>{p.network.toLowerCase()}</div>
            <div>{p.amount.toLocaleString()}</div>
            <div>{p.transactionId}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileMoneyForm