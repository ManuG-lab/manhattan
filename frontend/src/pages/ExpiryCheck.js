import React, { useEffect, useState, useCallback } from 'react';
import { expiryAPI } from '../services/api';
import { toast } from 'react-toastify';
import './ExpiryCheck.css';

function ExpiryCheck() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysThreshold, setDaysThreshold] = useState(30);

  const loadExpiryData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await expiryAPI.getClosest(daysThreshold);
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to load expiry data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [daysThreshold]);

  useEffect(() => {
    loadExpiryData();
  }, [loadExpiryData]);

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const daysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="page-container">
      <h1>Expiry Date Check</h1>
      
      <div className="expiry-filter">
        <label htmlFor="days">Check products expiring within:</label>
        <select 
          id="days"
          value={daysThreshold} 
          onChange={(e) => setDaysThreshold(parseInt(e.target.value))}
          className="filter-input"
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
          <option value={60}>60 days</option>
          <option value={90}>90 days</option>
        </select>
      </div>

      {loading ? (
        <p>Loading expiry data...</p>
      ) : products.length === 0 ? (
        <p className="no-data">No products expiring within the selected period</p>
      ) : (
        <div className="expiry-grid">
          {products.map(product => {
            const expired = isExpired(product.expiry_date);
            const daysLeft = daysUntilExpiry(product.expiry_date);
            
            return (
              <div 
                key={product.id} 
                className={`expiry-card ${expired ? 'expired' : daysLeft <= 7 ? 'urgent' : 'warning'}`}
              >
                <h3>{product.name}</h3>
                <p className="product-size">{product.size}</p>
                <p className="product-category">Category: {product.category}</p>
                <p className="product-price">Price: ${product.price.toFixed(2)}</p>
                <p className="product-stock">Stock: {product.stock_amount}</p>
                
                <div className="expiry-info">
                  <p className="expiry-date">
                    {expired ? (
                      <span className="expired-label">❌ EXPIRED</span>
                    ) : (
                      <>
                        <span className="days-left">⏰ {daysLeft} days left</span>
                        <br />
                        <span className="expiry-date-text">Expires: {product.expiry_date}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExpiryCheck;
