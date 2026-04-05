import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  
  // States
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [trainerForm, setTrainerForm] = useState({ id: null, name: '', specialty: '', experience: '', imageUrl: '' });
  const [priceForm, setPriceForm] = useState({ id: null, title: '', price: '', duration: '/month', features: '', isPopular: false });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const s = await session();
      const token = s.getIdToken().getJwtToken();

      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'users') {
        const res = await fetch('http://localhost:8080/api/admin/users', { headers });
        if (res.ok) setUsers(await res.json());
      } else if (activeTab === 'trainers') {
        const res = await fetch('http://localhost:8080/api/admin/trainers', { headers });
        if (res.ok) setTrainers(await res.json());
      } else if (activeTab === 'pricing') {
        const res = await fetch('http://localhost:8080/api/admin/prices', { headers });
        if (res.ok) setPrices(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getHeaders = async () => {
    const s = await session();
    return { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${s.getIdToken().getJwtToken()}`
    };
  };

  // ---- Users ----
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:8080/api/admin/users/${id}`, { method: 'DELETE', headers: await getHeaders() });
      setUsers(users.filter(u => u._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // ---- Trainers ----
  const saveTrainer = async (e) => {
    e.preventDefault();
    try {
      const method = trainerForm.id ? 'PUT' : 'POST';
      const url = trainerForm.id ? `http://localhost:8080/api/admin/trainers/${trainerForm.id}` : `http://localhost:8080/api/admin/trainers`;
      const res = await fetch(url, {
        method,
        headers: await getHeaders(),
        body: JSON.stringify(trainerForm)
      });
      if (res.ok) {
        setTrainerForm({ id: null, name: '', specialty: '', experience: '', imageUrl: '' });
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  const deleteTrainer = async (id) => {
    if (!window.confirm("Delete trainer?")) return;
    try {
      await fetch(`http://localhost:8080/api/admin/trainers/${id}`, { method: 'DELETE', headers: await getHeaders() });
      setTrainers(trainers.filter(t => t._id !== id));
    } catch (e) { console.error(e); }
  };

  // ---- Pricing ----
  const savePrice = async (e) => {
    e.preventDefault();
    try {
      const method = priceForm.id ? 'PUT' : 'POST';
      const url = priceForm.id ? `http://localhost:8080/api/admin/prices/${priceForm.id}` : `http://localhost:8080/api/admin/prices`;
      const payload = {
        ...priceForm,
        features: Array.isArray(priceForm.features) ? priceForm.features : priceForm.features.split(',').map(f => f.trim())
      };
      const res = await fetch(url, {
        method,
        headers: await getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setPriceForm({ id: null, title: '', price: '', duration: '/month', features: '', isPopular: false });
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  const deletePrice = async (id) => {
    if (!window.confirm("Delete rating plan?")) return;
    try {
      await fetch(`http://localhost:8080/api/admin/prices/${id}`, { method: 'DELETE', headers: await getHeaders() });
      setPrices(prices.filter(p => p._id !== id));
    } catch (e) { console.error(e); }
  };


  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2>Admin Dashboard</h2>
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
          <button className={`admin-tab ${activeTab === 'trainers' ? 'active' : ''}`} onClick={() => setActiveTab('trainers')}>Trainers</button>
          <button className={`admin-tab ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>Pricing</button>
        </div>

        <div className="admin-content">
          {loading ? <p>Loading...</p> : (
            <>
              {activeTab === 'users' && (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Email</th><th>Name</th><th>Role</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td>{u.email}</td><td>{u.name || '-'}</td>
                          <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                          <td><button className="btn-danger" onClick={() => deleteUser(u._id)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'trainers' && (
                <div className="admin-panel-section">
                  <form className="admin-form" onSubmit={saveTrainer}>
                    <h3>{trainerForm.id ? 'Edit Trainer' : 'Add New Trainer'}</h3>
                    <div className="form-group"><input type="text" placeholder="Name" required value={trainerForm.name} onChange={e => setTrainerForm({...trainerForm, name: e.target.value})} /></div>
                    <div className="form-group"><input type="text" placeholder="Specialty (e.g. Yoga)" required value={trainerForm.specialty} onChange={e => setTrainerForm({...trainerForm, specialty: e.target.value})} /></div>
                    <div className="form-group"><input type="text" placeholder="Experience (e.g. 5 years exp)" value={trainerForm.experience} onChange={e => setTrainerForm({...trainerForm, experience: e.target.value})} /></div>
                    <div className="form-group"><input type="text" placeholder="Image URL (http://...)" required value={trainerForm.imageUrl} onChange={e => setTrainerForm({...trainerForm, imageUrl: e.target.value})} /></div>
                    <div className="form-actions">
                      <button type="submit" className="btn-admin-submit">{trainerForm.id ? 'Update' : 'Create'}</button>
                      {trainerForm.id && <button type="button" className="btn-admin-cancel" onClick={() => setTrainerForm({ id: null, name: '', specialty: '', experience: '', imageUrl: '' })}>Cancel</button>}
                    </div>
                  </form>
                  <table className="admin-table">
                    <thead><tr><th>Image</th><th>Name</th><th>Specialty</th><th>Actions</th></tr></thead>
                    <tbody>
                      {trainers.map(t => (
                        <tr key={t._id}>
                          <td><img src={t.imageUrl} alt={t.name} style={{width: '40px', height: '40px', objectFit:'cover', borderRadius:'50%'}}/></td>
                          <td>{t.name}</td><td>{t.specialty}</td>
                          <td>
                            <button className="btn-edit" onClick={() => setTrainerForm({ id: t._id, name: t.name, specialty: t.specialty, experience: t.experience, imageUrl: t.imageUrl })}>Edit</button>
                            <button className="btn-danger" onClick={() => deleteTrainer(t._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="admin-panel-section">
                  <form className="admin-form" onSubmit={savePrice}>
                    <h3>{priceForm.id ? 'Edit Plan' : 'Add New Plan'}</h3>
                    <div className="form-group"><input type="text" placeholder="Plan Title (e.g. Monthly Plan)" required value={priceForm.title} onChange={e => setPriceForm({...priceForm, title: e.target.value})} /></div>
                    <div className="form-group"><input type="text" placeholder="Price (e.g. $49)" required value={priceForm.price} onChange={e => setPriceForm({...priceForm, price: e.target.value})} /></div>
                    <div className="form-group"><input type="text" placeholder="Duration (e.g. /month)" value={priceForm.duration} onChange={e => setPriceForm({...priceForm, duration: e.target.value})} /></div>
                    <div className="form-group"><textarea placeholder="Features (comma separated: WiFi, Showers...)" required value={typeof priceForm.features === 'string' ? priceForm.features : priceForm.features.join(', ')} onChange={e => setPriceForm({...priceForm, features: e.target.value})} /></div>
                    <div className="form-group checkbox">
                      <label><input type="checkbox" checked={priceForm.isPopular} onChange={e => setPriceForm({...priceForm, isPopular: e.target.checked})} /> Mark as Most Popular</label>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-admin-submit">{priceForm.id ? 'Update' : 'Create'}</button>
                      {priceForm.id && <button type="button" className="btn-admin-cancel" onClick={() => setPriceForm({ id: null, title: '', price: '', duration: '/month', features: '', isPopular: false })}>Cancel</button>}
                    </div>
                  </form>
                  <table className="admin-table">
                    <thead><tr><th>Title</th><th>Price</th><th>Popular</th><th>Actions</th></tr></thead>
                    <tbody>
                      {prices.map(p => (
                        <tr key={p._id}>
                          <td>{p.title}</td><td>{p.price} {p.duration}</td><td>{p.isPopular ? 'Yes' : 'No'}</td>
                          <td>
                            <button className="btn-edit" onClick={() => setPriceForm({ id: p._id, title: p.title, price: p.price, duration: p.duration, features: p.features.join(', '), isPopular: p.isPopular })}>Edit</button>
                            <button className="btn-danger" onClick={() => deletePrice(p._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
