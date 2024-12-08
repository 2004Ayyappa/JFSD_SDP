import React, { useState, useEffect } from 'react';
import '../css/user-profile.css'; // Ensure CSS file is present and styled
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [student, setStudent] = useState(null);

  // Fetch student details if username is available
  useEffect(() => {
    if (!state?.student?.username) {
      toast.error('You must be logged in to access this page.');
      navigate('/');
    } else {
      // Fetch student details using username
      const fetchStudentDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8080/student/get/${state.student.username}`);
          if (response.ok) {
            const studentData = await response.json();
            setStudent(studentData);
            setFormData({ email: studentData.email, password: '' }); // Initialize form data
          } else {
            toast.error('Failed to fetch student details.');
          }
        } catch (error) {
          console.error('Error fetching student details:', error);
          toast.error('An error occurred while fetching student details.');
        }
      };

      fetchStudentDetails();
    }
  }, [state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update email and password
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/student/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: student.username, // Keep the username same
          email: formData.email,
          password: formData.password || undefined, // Only send password if updated
        }),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        setStudent(updatedStudent); // Update local state
        toast.success('Profile updated successfully!');
        setIsEditing(false); // Exit edit mode
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  if (!student) {
    return <p>Loading...</p>; // Show loading until data is fetched
  }

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
  return ( <div className="dashboard-container">
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
    <div className="user-profile-container">
      <h1>User Profile</h1>
      {!isEditing ? (
        <div className="profile-details">
          <p><strong>Username:</strong> {student.username}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="profile-form">
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={student.username}
              disabled
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <small>Leave blank if you don’t want to update password.</small>
          </label>
          <button type="submit" className="save-button">Save Changes</button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </form>
      )}
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
    </div>
    </div>
  );
};

export default UserProfile;
