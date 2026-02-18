import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Static credentials for demonstration
  const VALID_USERS = [
    { email: 'admin@hardware.com', password: 'admin123', name: 'Admin' },
    { email: 'manager@hardware.com', password: 'manager123', name: 'Manager' },
    { email: 'user@hardware.com', password: 'user123', name: 'User' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    const user = VALID_USERS.find(u => u.email === email && u.password === password);

    if (user) {
      onLogin(user);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🔧 Hardware Management System</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: admin@hardware.com | Password: admin123</p>
          <p>Email: manager@hardware.com | Password: manager123</p>
          <p>Email: user@hardware.com | Password: user123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
