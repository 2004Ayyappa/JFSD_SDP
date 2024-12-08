import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/UserLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.text(); // Get the response as plain text

      if (response.ok && data === "200") {
        toast.success("successfully log in")
        // If login is successful, navigate to the student dashboard
        setTimeout(() => {
        navigate('/admin-dashboard',{ state: { admin: {username: username } } });
        }, 1000);
      } else {
        // If login fails, show an error message
        if (data === "401") {
          toast.error("Invalid username or password.");
        } else {
          toast.error(data || 'An error occurred. Please try again.');
        }
      }
    } catch (error) {
      toast.error('An error occurred while trying to log in. Please try again later.');
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
            <form onSubmit={handleSubmit} className="login-form">
              <h2>Admin Login</h2>
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
                />
              </div>
              <button type="submit" className="login-button">Login</button>
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

export default AdminLogin;
