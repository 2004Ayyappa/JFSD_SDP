import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Signup from './components/UserSignup';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/studentDashboard';
import './App.css';
import Navigation from './components/Navigation';
import UserLogin from './components/UserLogin';
import RegisterEvents from './components/RegisterEvents';
import RegisteredEvents from './components/RegisteredEvents';
import ManageEvents from './components/ManageEvents';
import { ToastContainer } from 'react-toastify';
import UserProfile from './components/UserProfile';
const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar that stays visible across all routes */}
        {/* <Navigation /> */}
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
        {/* Main Content */}
        <Routes>
          <Route path="/" element={<Navigation/>} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/user-signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/register-events" element={<RegisterEvents/>} /> 
          <Route path="/registered-events" element={<RegisteredEvents/>} />
          <Route path="/manage-events" element={<ManageEvents/>} />
          <Route path="/user-profile" element={<UserProfile/>} />
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
