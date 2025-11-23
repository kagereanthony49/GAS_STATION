import React from 'react'
import { useAppStore } from '../store/hooks.js'
import jsPDF from 'jspdf'

const GrandTotal = ({ meterReadings, fuelPrices, mobilePayments, employeeInfo, onSubmitReport }) => {
  const { addReport } = useAppStore()
  const number = (v) => parseFloat(v) || 0
  const litres = (t) => {
    const m1 = number(meterReadings[t]?.m1)
    const m2 = number(meterReadings[t]?.m2)
    return m2 > m1 ? m2 - m1 : 0
  }
  const revenue = (t) => litres(t) * fuelPrices[t]
  const mobileTotal = mobilePayments.reduce((s, p) => s + (p.amount || 0), 0)
  const total = revenue('pms') + revenue('ago') + revenue('bik') + mobileTotal

  const generatePdf = () => {
    const doc = new jsPDF()
    doc.text('Gas Pro - Daily Sales Report', 20, 20)
    doc.text(`Submission Time: ${new Date().toLocaleString()}`, 20, 30)
    doc.text(`Employee: ${employeeInfo?.name || ''}`, 20, 40)
    doc.text('Meter Readings', 20, 55)
    doc.text(`PMS m1: ${meterReadings.pms.m1} m2: ${meterReadings.pms.m2} litres: ${litres('pms').toFixed(2)} price: UGX ${fuelPrices.pms.toLocaleString()}`, 20, 65)
    doc.text(`AGO m1: ${meterReadings.ago.m1} m2: ${meterReadings.ago.m2} litres: ${litres('ago').toFixed(2)} price: UGX ${fuelPrices.ago.toLocaleString()}`, 20, 75)
    doc.text(`BIK m1: ${meterReadings.bik.m1} m2: ${meterReadings.bik.m2} litres: ${litres('bik').toFixed(2)} price: UGX ${fuelPrices.bik.toLocaleString()}`, 20, 85)
    doc.text('Mobile Money Payments', 20, 100)
    mobilePayments.forEach((p, i) => {
      doc.text(`${i + 1}. ${p.network} UGX ${p.amount.toLocaleString()} TX: ${p.transactionId}`, 20, 110 + i * 10)
    })
    doc.text(`Grand Total: UGX ${total.toLocaleString()}`, 20, 140)
    doc.save('daily_report.pdf')
  }

  const submit = () => {
    const report = {
      meterReadings,
      mobilePayments,
      fuelPrices,
      totals: { pms: revenue('pms'), ago: revenue('ago'), bik: revenue('bik'), mobile: mobileTotal, grand: total },
      employee: employeeInfo,
      timestamp: new Date().toISOString(),
    }
    addReport(report)
    onSubmitReport?.(report)
  }

  return (
    <div className="card" style={{ margin: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ color: 'var(--primary-color)', marginTop: 0 }}>GRAND TOTAL</h3>
        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>UGX {total.toLocaleString()}</div>
      </div>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button onClick={generatePdf}>Generate Report</button>
        <button onClick={submit}>Submit Report</button>
      </div>
    </div>
  )
}

export default GrandTotal