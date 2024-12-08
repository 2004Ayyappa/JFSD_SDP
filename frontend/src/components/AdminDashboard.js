import React, { useEffect, useState } from 'react';
import '../css/admin-dashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
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
  const [editEventId, setEditEventId] = useState(null);
  
  // New state for active sidebar menu
  const [activeMenu, setActiveMenu] = useState('manageEvents');

  useEffect(() => {
    if (admin) {
      switch(activeMenu) {
        case 'manageEvents':
          fetchEvents();
          break;
        case 'participants':
          fetchAllParticipants();
          break;
        default:
          fetchEvents();
      }
    }
  }, [admin, activeMenu]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events');
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again.');
      setLoading(false);
    }
  };

  const fetchAllParticipants = async () => {
    try {
      const response = await fetch('http://localhost:8080/student/get');
      const data = await response.json();
      setParticipants(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all participants:', error);
      toast.error('Failed to load participants. Please try again.');
      setLoading(false);
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
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast.success(editEventId ? 'Event updated successfully!' : 'Event created successfully!');
      fetchEvents();
      handleClear();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save the event. Please try again.');
    }
  };

  const handleEdit = (event) => {
    setNewEvent({
      eventName: event.eventName,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      image: null, // Reset image for editing
    });
    setEditEventId(event.id);
    toast.info('Editing the selected event. Update the details and save.');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast.success('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete the event. Please try again.');
    }
  };

  const handleRemoveParticipant = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/student/deleteStudent/${id}`, {
          method: "DELETE",
      });
      if (response.ok) {
          toast.success("Student deleted successfully");
          fetchAllParticipants();
      } else {
          console.error("Failed to delete student:", await response.text());
      }
  } catch (error) {
      console.error("Error:", error);
  }
  };

  // Render different content based on active menu
  const renderContent = () => {
    switch(activeMenu) {
      case 'manageEvents':
        return (
          <>
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
          </>
        );
      
      case 'participants':
        return (
          <>
            <h3>Participants List</h3>
            <table className="participants-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id}>
                    <td>{participant.username}</td>
                    <td>{participant.email}</td>
                    <td>
                      <button onClick={() => handleRemoveParticipant(participant.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        );
      
      default:
        return null;
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
            onClick={() => {
              toast.success('Logged out successfully!');
              setTimeout(() => navigate('/'), 2000);
            }}
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
            <li 
              className={activeMenu === 'manageEvents' ? 'active' : ''}
              onClick={() => setActiveMenu('manageEvents')}
            >
              Manage Events
            </li>
            <li 
              className={activeMenu === 'participants' ? 'active' : ''}
              onClick={() => setActiveMenu('participants')}
            >
              Participants
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;