import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Profile.css';

const Profile = () => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({ name: '', bio: '', weight: '', startingWeight: '', goal: '', email: '', progressHistory: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [timeView, setTimeView] = useState('week');
  const [chartData, setChartData] = useState([]);

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

  const fetchWeightData = useCallback(async () => {
    try {
      const token = await getValidToken();
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/weight/${timeView}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        let data = await response.json();

        // NO BLANK SCREENS RULE: Guaranteed baseline anchors explicitly linked to their primary attributes
        const startWt = parseFloat(profile.startingWeight);
        const currWt = parseFloat(profile.weight);

        // Find the absolute last available non-future bucket index
        let currIdx = data.length - 1;
        while (currIdx >= 0 && data[currIdx].weight === null && currIdx !== 0) {
           currIdx--; // Move backwards looking for the last plotted actual point or the end of the strict timeline block mapped by the backend
        }
        
        // If the backend didn't supply enough real data entries, anchor the edges securely leveraging connectNulls slope math.
        if (data[0] && data[0].weight === null && !isNaN(startWt)) data[0].weight = startWt;
        
        let todayIdx = data.length - 1;
        if (timeView === 'week') {
           todayIdx = 6; // Last 7 rolling days, today is always max index 6
        } else if (timeView === 'month') {
           todayIdx = new Date().getDate() - 1; // 0-indexed for 1st-31st
        } else if (timeView === 'year') {
           todayIdx = new Date().getMonth(); // 0-indexed Jan-Dec
        }

        if (data[todayIdx] && data[todayIdx].weight === null && !isNaN(currWt)) data[todayIdx].weight = currWt;

        setChartData(data);
      }
    } catch (err) {
      console.error('Failed to fetch weight data:', err);
    }
  }, [timeView, getValidToken]);

  useEffect(() => {
    fetchWeightData();
  }, [fetchWeightData]);

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
          startingWeight: profile.startingWeight,
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
      
      // Instantly refresh chart and profile states so UI follows user explicitly as requested
      await fetchProfile();
      await fetchWeightData();

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
        


        {/* RIGHT MAIN CONTENT */}
        <main className="dashboard-content">
          <div className="content-header">
            <div>
              <h2>Personal Information</h2>
              <p>Manage your fitness journey details.</p>
            </div>
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
                  <label>Starting Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    name="startingWeight" 
                    value={profile.startingWeight || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. 85" 
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Current Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    name="weight" 
                    value={profile.weight || ''} 
                    onChange={handleChange} 
                    placeholder="e.g. 75" 
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
              <div className="hero-name-plate">
                <h1 className="hero-name">{profile.name || 'FITNESS ENTHUSIAST'}</h1>
                <div className="hero-goal-badge">Goal: {profile.goal || 'Not Set'}</div>
              </div>

              <div className="bio-container">
                <p className="bio-text">
                  {profile.bio || 'No bio provided. Click Edit Profile to add your fitness journey and personal background.'}
                </p>
              </div>

              {/* PREMIUM CHART WIDGET */}
              <div className="premium-chart-widget">
                <div className="chart-stats-header">
                  <div className="chart-stat">
                    <span className="c-label">Current Weight Tracking</span>
                    <span className="c-value">{profile.weight || '--'} <small>kg</small></span>
                  </div>
                  <div className="chart-divider"></div>
                  <div className="chart-toggle-group">
                    <button className={`toggle-btn ${timeView === 'week' ? 'active' : ''}`} onClick={() => setTimeView('week')}>Week</button>
                    <button className={`toggle-btn ${timeView === 'month' ? 'active' : ''}`} onClick={() => setTimeView('month')}>Month</button>
                    <button className={`toggle-btn ${timeView === 'year' ? 'active' : ''}`} onClick={() => setTimeView('year')}>Year</button>
                  </div>
                </div>

                <div className="chart-container-render">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={35} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #2d2d33', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" connectNulls={true} dataKey="weight" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="progress-section">
                <h3 className="section-title">Progress Overview</h3>
                <div className="progress-cards">
                  <div className="progress-card">
                    <h4>Starting Weight</h4>
                    <p className="stat">{profile.startingWeight ? `${profile.startingWeight} kg` : '--'}</p>
                  </div>
                  <div className="progress-card">
                    <h4>Current Weight</h4>
                    <p className="stat current">{profile.weight ? `${profile.weight} kg` : '--'}</p>
                  </div>
                  <div className="progress-card highlight">
                    <h4>Total Lost</h4>
                    <p className="stat lost">
                      {(profile.startingWeight && profile.weight && !isNaN(profile.startingWeight) && !isNaN(profile.weight)) 
                        ? `${(parseFloat(profile.startingWeight) - parseFloat(profile.weight)).toFixed(1)} kg` 
                        : '--'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="footer-actions">
            {!isEditing && (
              <button className="btn-premium btn-edit" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
            <button className="btn-premium btn-minimal btn-logout-new" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </main>

      </div>
    </div>
  );
};

export default Profile;
