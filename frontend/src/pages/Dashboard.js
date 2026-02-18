import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container"><p>Loading...</p></div>;
  }

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <h3>Total Products</h3>
          <p className="stat-value">{stats?.total_products || 0}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Total Stock</h3>
          <p className="stat-value">{stats?.total_stock || 0}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <h3>Total Sales</h3>
          <p className="stat-value">{stats?.total_sales || 0}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <h3>Total Revenue</h3>
          <p className="stat-value">${(stats?.total_revenue || 0).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
