import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/UserLogin.css';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // for disabling the submit button
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLoginClick = async () => {
    if (!username || !password) {
      toast.error("Username and Password are required.");
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      const response = await fetch('http://localhost:8080/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json(); // Parse JSON response
      setLoading(false); // Stop loading
  
      if (response.ok) {
        toast.success(data.message || 'Successfully logged in!');
        localStorage.setItem('studentUsername', data.username);
        setTimeout(() => {
          navigate('/student-dashboard', { state: { student: { username: data.username,email: data.email } } });
        }, 2000);
      } else {
        toast.error(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      toast.error('An error occurred. Please try again later.');
      console.error('Login error:', error);
    }
  };
  
  
  return (
    <div>
      {/* Navigation Bar */}
      <nav>
        <div className="container">
          <div className="logo">Student Extracurricular Activities Management System</div>
          <ul>
            <li><a href="/" className="nav-link">Home</a></li>
            <li className="dropdown">
              <a href="#" className="nav-link" onClick={toggleDropdown}>
                Login
                <span className="dropdown-arrow">▼</span>
              </a>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><a href="/user-login" className="dropdown-item">User Login</a></li>
                  <li><a href="/user-signup" className="dropdown-item">User Signup</a></li>
                  <li><a href="/admin-login" className="dropdown-item">Admin Login</a></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="login-container">
            <div className="login-form">
              <h2>User Login</h2>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off" // For better security
                />
              </div>
              <button 
                type="button" 
                className="login-button" 
                onClick={handleLoginClick} 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ToastContainer for toast notifications */}
  
    </div>
  );
};

export default UserLogin;
