import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/UserLogin.css';
import { toast, ToastContainer } from 'react-toastify';
const UserSignup = () => {
const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/student/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.text(); // Get the response as plain text

      if (response.ok && data === 'New Student has been added') {
        // If signup is successful, navigate to the user login page
        toast.success(data ||'Signup successful! You can now log in.');
        navigate('/user-login');
      } else {
        // If signup fails, show an error message
        toast.error(data || 'An error occurred. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while trying to sign up. Please try again later.');
      console.error('Signup error:', error);
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
            <form onSubmit={handleSubmit} className="login-form">
              <h2>User Signup</h2>
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
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>
              <button type="submit" className="login-button">Signup</button>
            </form>
          </div>
        </div>
      </section>
 
     {/* ToastContainer for toast notifications */}
     <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default UserSignup;
