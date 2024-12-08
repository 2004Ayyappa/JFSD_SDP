import React, { useState } from 'react';

const Navigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="container">
          <div className="logo">Student Extracurricular Activities Management System</div>
          
          <ul className="nav-links">
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
          
          <h1>Welcome to the Extracurricular Activities Manager</h1>
          <p>Empowering students to engage, participate, and excel in various extracurricular activities...</p>
          {/* Features Section */}
          <section className="container features">
            <div className="feature">
              <h3>For Students</h3>
              <p>Register for activities, track your participation, and stay updated with upcoming events all in one place.</p>
              <a href="/user-login" className="button button-outline">Login</a>
            </div>
            <div className="feature">
              <h3>For Administrators</h3>
              <p>Manage extracurricular schedules, track student involvement, and update events effortlessly.</p>
              <a href="/admin-login" className="button button-outline">Admin Login</a>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Navigation;