import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/student-dashboard.css';

const StudentDashboard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [student, setStudent] = useState(state?.student || null);
  const [loading, setLoading] = useState(true);

  // Redirect to login if no student is available
  useEffect(() => {
    console.log('Location state:', state);
    if (!state?.student) {
      toast.error('You must be logged in to access this page.');
      navigate('/');
    } else {
      setStudent(state.student);
    }
  }, [state, navigate]);

  // Fetch events only when student is set
  useEffect(() => {
    if (student) {
      fetchEvents();
    }
  }, [student]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Unable to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const registerEvent = async (event) => {
    if (!student?.username) {
      console.error('Error: student username is missing or undefined');
      toast.error('Student username is missing. Please log in again.');
      return;
    }

    const payload = {
      studentUsername: student.username,
      eventId: event.id,
    };
    console.log('Sending payload:', payload);

    try {
      const response = await fetch('http://localhost:8080/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Successfully registered for the event!');
        fetchEvents();
      } else if (response.status === 409) {
        toast.error('You are already registered for this event.');
      } else {
        toast.error('You are already registered for this event.');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const navigateToUserProfile = () => {
    if (student?.username) {
      navigate('/user-profile', { state: { student } });
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
  const navigateToRegisterEvents = () => {
    if (student?.username) {
      navigate('/register-events', { state: { student } });
    } else {
      toast.error('You must be logged in to access this page.');
    }
  };
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">Student Extracurricular Activities Management System</div>
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
          <h1>Student Dashboard</h1>
          <h2>Available Events</h2>
          {loading ? (
            <p>Loading...</p>
          ) : events.length === 0 ? (
            <p>No events available at the moment.</p>
          ) : (
            <div className="event-list">
              {events.map((event) => (
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
                      onClick={() => registerEvent(event)}
                      className="register-button"
                    >
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <footer className="dashboard-footer">Copyright © Student Manager. All rights reserved.</footer>
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

export default StudentDashboard;
