import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({ name: '', bio: '', weight: '', goal: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);

  const getValidToken = useCallback(async () => {
    try {
      const currentSession = await session();
      return currentSession.getIdToken().getJwtToken();
    } catch (err) {
      logout();
      navigate('/login');
      throw err;
    }
  }, [session, logout, navigate]);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getValidToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      let data = {};
      try {
        data = await response.json();
      } catch {}

      if (response.ok) {
        setProfile(prev => ({ ...prev, ...data }));
        return;
      }

      if (response.status === 401) {
        logout();
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getValidToken, logout, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const token = await getValidToken();
      if (!token) {
        setMessage({ text: 'Session expired. Please login again.', type: 'error' });
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          weight: profile.weight,
          goal: profile.goal,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {}

      if (!response.ok) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false); // Snap back to view mode on successful save

      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error('Save error:', err);
      setMessage({ text: err.message || 'Something went wrong', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="profile-loading"><div className="loader"></div></div>;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-dashboard-premium">
        
        {/* LEFT SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3>Dashboard</h3>
            <p className="user-email">{profile.email || 'user@example.com'}</p>
          </div>
          <nav className="sidebar-nav">
            <button className="nav-btn active">Personal Info</button>
            <button className="nav-btn logout-btn" onClick={handleLogout}>Log Out</button>
          </nav>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="dashboard-content">
          <div className="content-header">
            <div>
              <h2>Personal Information</h2>
              <p>Manage your fitness journey details.</p>
            </div>
            {!isEditing && (
              <button className="btn-premium btn-edit" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {message.text && (
            <div className={`status-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {isEditing ? (
            /* EDIT MODE */
            <form className="premium-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={profile.name || ''} 
                  onChange={handleChange} 
                  placeholder="Enter your full name" 
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Current Weight</label>
                  <input 
                    type="text" 
                    name="weight" 
                    value={profile.weight || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. 75kg" 
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Fitness Goal</label>
                  <input 
                    type="text" 
                    name="goal" 
                    value={profile.goal || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. Build Muscle" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Bio (Optional)</label>
                <textarea 
                  name="bio" 
                  value={profile.bio || ''} 
                  onChange={handleChange} 
                  placeholder="Tell us about your fitness journey..." 
                  rows="4"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-premium btn-minimal" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-premium btn-save" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* VIEW MODE */
            <div className="profile-view-card">
              <div className="view-row">
                <div className="view-group">
                  <span className="view-label">Full Name</span>
                  <p className="view-value">{profile.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="view-row split">
                <div className="view-group">
                  <span className="view-label">Current Weight</span>
                  <p className="view-value">{profile.weight || 'Not provided'}</p>
                </div>
                <div className="view-group">
                  <span className="view-label">Fitness Goal</span>
                  <p className="view-value">{profile.goal || 'Not provided'}</p>
                </div>
              </div>
              <div className="view-row">
                <div className="view-group">
                  <span className="view-label">Bio</span>
                  <p className="view-value bio-text">
                    {profile.bio || 'No bio provided. Click Edit Profile to add one.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Profile;
