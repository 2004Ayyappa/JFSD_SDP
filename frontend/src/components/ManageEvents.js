import React, { useEffect, useState } from 'react';
import '../css/admin-dashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';
const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    description: '',
    eventDate: '',
    eventTime: '',
    image: null,
  });
  const [admin, setAdmin] = useState(state?.admin || null);
  const [loading, setLoading] = useState(true);

  // Redirect to login if no admin is available
  useEffect(() => {
    console.log('Location state:', state);
    if (!state?.admin) {
      alert('You must be logged in to access this page.');
      navigate('/');
    } else {
      setAdmin(state.admin);
    }
  }, [state, navigate]);

  // Fetch events only when student is set
  useEffect(() => {
    if (admin) {
      fetchEvents();
    }
  }, [admin]);
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleClear = () => {
    setNewEvent({
      eventName: '',
      description: '',
      eventDate: '',
      eventTime: '',
      image: null,
    });
    setEditEventId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editEventId
      ? `http://localhost:8080/api/events/${editEventId}`
      : 'http://localhost:8080/api/events';
    const method = editEventId ? 'PUT' : 'POST';

    const formData = new FormData();
    for (let key in newEvent) {
      formData.append(key, newEvent[key]);
    }

    try {
      await fetch(url, {
        method,
        body: formData,
      });
      fetchEvents();
      handleClear();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event) => {
    setNewEvent(event);
    setEditEventId(event.id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/events/${id}`, {
        method: 'DELETE',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="dashboard-container">
    <header className="dashboard-header">
      <div className="header-title">Student Extracurricular Activities Management System</div>
      <div className="header-user-info">
        {admin?.username || 'Guest'}
        <button
          className="logout-button"
          onClick={() => navigate('/')}
        >
          Logout
        </button>
      </div>
    </header>
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li>Manage Events</li>
          <li>Participants</li>
          <li>Reports</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Manage Events</h1>
        <form onSubmit={handleSubmit} className="event-form">
          <input
            type="text"
            name="eventName"
            value={newEvent.eventName}
            placeholder="Event Name"
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            value={newEvent.description}
            placeholder="Description"
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="eventDate"
            value={newEvent.eventDate}
            onChange={handleInputChange}
            required
          />
          <input
            type="time"
            name="eventTime"
            value={newEvent.eventTime}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
          />
          <div className="form-buttons">
            <button type="submit">{editEventId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>

        <h3>Event List</h3>
        <table className="event-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  {event.image && (
                    <img
                      src={`data:image/png;base64,${event.image}`}
                      alt={event.eventName}
                      width="100"
                    />
                  )}
                </td>
                <td>{event.eventName}</td>
                <td>{event.description}</td>
                <td>{event.eventDate}</td>
                <td>{event.eventTime}</td>
                <td>
                  <button onClick={() => handleEdit(event)}>Edit</button>
                  <button onClick={() => handleDelete(event.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default ManageEvents;
