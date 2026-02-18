import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('authUser'));

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          🔧 Hardware Manager
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link">Products</Link>
          </li>
          <li className="nav-item">
            <Link to="/add-product" className="nav-link">Add Product</Link>
          </li>
          <li className="nav-item">
            <Link to="/sales" className="nav-link">Sales</Link>
          </li>
          <li className="nav-item">
            <Link to="/expiry-check" className="nav-link">Expiry Check</Link>
          </li>
        </ul>
        <div className="nav-user">
          <span className="user-info">{user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
