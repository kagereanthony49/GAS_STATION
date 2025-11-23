// src/components/FuelCard.jsx

import React from 'react';
import '../styles/FuelCard.css';

const FuelCard = ({ fuelType, readings, pricePerLitre, onMeterChange }) => {
  // Calculate the derived values
  const m1 = parseFloat(readings.m1) || 0;
  const m2 = parseFloat(readings.m2) || 0;
  
  // Ensure m2 is greater than m1 for valid calculation
  const litresSold = m2 > m1 ? m2 - m1 : 0;
  const revenue = litresSold * pricePerLitre;

  return (
    <div className="fuel-card">
      <h3>{fuelType}</h3>
      <div className="input-group">
        <input 
          type="number" 
          placeholder="input m1" 
          value={readings.m1}
          onChange={(e) => onMeterChange('m1', e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="input m2" 
          value={readings.m2}
          onChange={(e) => onMeterChange('m2', e.target.value)}
        />
      </div>
      <div className="results-group">
        <p>Litres Sold: <span>{litresSold.toFixed(2)} L</span></p>
        <p>Price / Litre: <span>UGX {pricePerLitre.toLocaleString()}</span></p>
        <p className="revenue">Revenue: <span>UGX {revenue.toLocaleString()}</span></p>
      </div>
    </div>
  );
};

export default FuelCard;