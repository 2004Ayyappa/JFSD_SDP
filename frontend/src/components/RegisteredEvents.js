import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/student-dashboard.css';
const RegisteredEvents = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const student = state?.student;

  useEffect(() => {
    if (!student?.username) {
      toast.error('You must be logged in to access this page.');
      navigate('/');
    } else {
      fetchRegisteredEvents(student.username);
    }
  }, [student, navigate]);

  const fetchRegisteredEvents = async (username) => {
    try {
      const response = await fetch(`http://localhost:8080/api/registrations/${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch registered events.');
      }
      const data = await response.json();
      setRegisteredEvents(data);
    } catch (error) {
      console.error('Error fetching registered events:', error);
      toast.error('Unable to load registered events. Please try again later.');
    }
  };

  const cancelRegistration = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/registrations/${student.username}/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Successfully canceled registration.');
        fetchRegisteredEvents(student.username);
      } else {
        toast.error('Failed to cancel registration. Please try again.');
      }
    } catch (error) {
      console.error('Error canceling registration:', error);
      toast.error('An error occurred. Please try again.');
    }
  };
  const navigateToRegisterEvents = () => {
    if (student?.username) {
      navigate('/register-events', { state: { student } });
    } else {
      toast.error('You must be logged in to access this page.');
    }
  };
  
  const navigateToRegisteredEvents = () => {
    if (student?.username) {
      navigate('/registered-events', { state: { student } });
    } else {
      toast.error('You must be logged in to access this page.');
    }
  };
  const navigateToUserProfile = () => {
    if (student?.username) {
      navigate('/user-profile', { state: { student } });
    } else {
      toast.error('You must be logged in to access this page.');
    }
  };
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">My Registered Events</div>
        <div className="header-user-info">
          {student?.username || 'Guest'}
          <button
      className="logout-button"
      onClick={() => {
        toast.success('Logged out successfully!');
        setTimeout(() => navigate('/'), 2000);
      }}
    >
      Logout
    </button>
        </div>
      </header>
  
      <div className="dashboard-body">
      <nav className="sidebar-menu">
          <ul className="menu-list">
            <li onClick={navigateToUserProfile}>User Profile</li>
          </ul>
          <ul className="menu-list">
          <li onClick={navigateToRegisterEvents}>Events</li>
          </ul>
          <ul className="menu-list">
            <li onClick={navigateToRegisteredEvents}>My Events</li>
          </ul>
        </nav>
        <main className="dashboard-main-content">
          <h1>Registered Events</h1>
          {registeredEvents.length === 0 ? (
            <p>You have not registered for any events yet.</p>
          ) : (
            <div className="event-list">
              {registeredEvents.map((event) => (
                <div key={event.id} className="event-card">
                  {event.image && (
                    <img
                      src={`data:image/png;base64,${event.image}`}
                      alt={event.eventName}
                      className="event-image"
                    />
                  )}
                  <div className="event-info">
                    <h3>{event.eventName}</h3>
                    <p>{event.description}</p>
                    <p>
                      Date: {event.eventDate} | Time: {event.eventTime}
                    </p>
                    <button
                      onClick={() => cancelRegistration(event.id)}
                      className="cancel-button"
                    >
                      Cancel Registration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <footer className="dashboard-footer">
        Copyright © Student Manager. All rights reserved.
      </footer>
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

export default RegisteredEvents;
