import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';
import Prism from '../Background/Prism';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginStatus('loading');
    setErrorMessage('');

    try {
      const response = await axios.post('https://shubham-portfolio-api-3i28.onrender.com/api/admin/login', credentials);

      const { status, message, data } = response.data;

      if (status === 200 && data) {
        setLoginStatus('success');

        localStorage.setItem('token', data);
        localStorage.setItem('isAdminAuthenticated', 'true');

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        setLoginStatus('error');
        setErrorMessage(message || 'Access Denied. Invalid credentials.');
      }
    } catch (err) {
      setLoginStatus('error');
      setErrorMessage(
        err.response?.data?.message || 'Server connection failed. Ensure your backend is running!'
      );
    }
  };

  return (
    <div className="admin-login-section">

      <div className="login-shader-bg">
        <Prism
          animationType="rotate"
          timeScale={0.4}
          height={3.0}
          baseWidth={5.0}
          scale={3.5}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="admin-avatar">🔒</div>
          <h2>Admin Portal</h2>
          <p>Secure Management Access</p>
        </div>

        {/* 🌟 GUEST CREDENTIALS INFO BLOCK */}
        <div className="guest-login-banner">
          <div className="guest-banner-title">💡 Guest Review Access</div>
          <div className="guest-credential-item">
            <span>ID:</span> <strong>guest</strong>
          </div>
          <div className="guest-credential-item">
            <span>Password:</span> <strong>guest123</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {loginStatus === 'error' && (
            <div className="login-error-banner">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter admin username"
                disabled={loginStatus === 'loading'}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter secure password"
                disabled={loginStatus === 'loading'}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loginStatus === 'loading' || loginStatus === 'success'}
          >
            {loginStatus === 'loading' ? 'Authenticating...' : loginStatus === 'success' ? 'Access Granted ✓' : 'Login Dashboard'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default AdminLogin;