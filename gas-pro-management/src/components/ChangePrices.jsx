// src/components/ChangePrices.jsx

import React, { useState } from 'react';
import '../styles/ChangePrices.css';

const ChangePrices = ({ prices, onPriceChange }) => {
  // Local state to hold the new price inputs
  const [newPrices, setNewPrices] = useState({ pms: '', ago: '', bik: '' });

  const handleInputChange = (fuelType, value) => {
    setNewPrices({ ...newPrices, [fuelType]: value });
  };

  const handleSavePrice = (fuelType) => {
    const newPriceValue = parseFloat(newPrices[fuelType]);
    if (!isNaN(newPriceValue) && newPriceValue > 0) {
      onPriceChange(fuelType, newPriceValue);
      // Clear the input field after saving
      setNewPrices({ ...newPrices, [fuelType]: '' });
    } else {
      alert('Please enter a valid price.');
    }
  };

  return (
    <div className="price-changer-card card">
      <h2>Change Fuel Prices</h2>
      <div className="fuel-price-item">
        <span>PMS (Petrol): <strong>UGX {prices.pms.toLocaleString()}</strong></span>
        <div className="set-price-form">
          <input
            type="number"
            placeholder="Set new price"
            value={newPrices.pms}
            onChange={(e) => handleInputChange('pms', e.target.value)}
          />
          <button onClick={() => handleSavePrice('pms')}>Save New Price</button>
        </div>
      </div>
      <div className="fuel-price-item">
        <span>AGO (Diesel): <strong>UGX {prices.ago.toLocaleString()}</strong></span>
        <div className="set-price-form">
          <input
            type="number"
            placeholder="Set new price"
            value={newPrices.ago}
            onChange={(e) => handleInputChange('ago', e.target.value)}
          />
          <button onClick={() => handleSavePrice('ago')}>Save New Price</button>
        </div>
      </div>
      <div className="fuel-price-item">
        <span>BIK (Kerosene): <strong>UGX {prices.bik.toLocaleString()}</strong></span>
        <div className="set-price-form">
          <input
            type="number"
            placeholder="Set new price"
            value={newPrices.bik}
            onChange={(e) => handleInputChange('bik', e.target.value)}
          />
          <button onClick={() => handleSavePrice('bik')}>Save New Price</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePrices;