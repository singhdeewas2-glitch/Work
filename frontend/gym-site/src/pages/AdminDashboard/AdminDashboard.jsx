/*
AdminDashboard Component
Handles gym administration interface for managing members, trainers, and pricing
Provides CRUD operations for gym management data
*/

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, API_BASE_URL, handleApiError } from '../../config/apiConfig';
import { contentService } from '../../services/contentService';
import { useConfig } from '../../context/ConfigContext';
import AdminEditorModal from '../../components/AdminEditorModal/AdminEditorModal';
import { trainerService } from '../../services/trainerService';
import { pricingService } from '../../services/pricingService';

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

const AdminDashboard = () => {
  const { session } = useAuth();
  const { refreshConfig } = useConfig() || {};
  const [activeTab, setActiveTab] = useState('members');
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [prices, setPrices] = useState([]);
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trainerForm, setTrainerForm] = useState({ id: null, name: '', specialty: '', experience: '', imageUrl: '' });
  const [priceForm, setPriceForm] = useState({ id: null, title: '', price: '', duration: '/month', features: '', isPopular: false });
  const [configForm, setConfigForm] = useState({ whatsapp: '', phone: '', email: '', address: '', mapsLink: '' });
  const [isTrainerEditorOpen, setIsTrainerEditorOpen] = useState(false);
  const [isPricingEditorOpen, setIsPricingEditorOpen] = useState(false);

  const trainerSchema = [
    { key: 'name', label: 'Trainer Name', type: 'text', required: true },
    { key: 'specialty', label: 'Specialty/Role', type: 'text', required: true },
    { key: 'experience', label: 'Experience (e.g. 5 Years)', type: 'text' },
    { key: 'image', label: 'Trainer Image', type: 'image', required: true },
  ];

  const handleTrainerSave = async (payload, id, token) => {
    let res;
    if (id) {
      res = await trainerService.updateTrainer(id, payload, token);
    } else {
      res = await trainerService.createTrainer(payload, token);
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save trainer');
    }
    await fetchData('trainers');
  };

  const handleTrainerDelete = async (id, token) => {
    const res = await trainerService.deleteTrainer(id, token);
    if (!res.ok) throw new Error('Failed to delete trainer');
    await fetchData('trainers');
  };

  const pricingSchema = [
    { key: 'title', label: 'Plan Title', type: 'text', required: true },
    { key: 'price', label: 'Price (e.g. $50)', type: 'text', required: true },
    { key: 'duration', label: 'Duration (e.g. /month)', type: 'text', default: '/month' },
    { key: 'features', label: 'Features', type: 'array' },
    { key: 'isPopular', label: 'Mark as Most Popular', type: 'boolean' },
  ];

  const handlePricingSave = async (payload, id, token) => {
    let res;
    if (id) {
      res = await pricingService.updatePlan(id, payload, token);
    } else {
      res = await pricingService.createPlan(payload, token);
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save plan');
    }
    await fetchData('pricing');
  };

  const handlePricingDelete = async (id, token) => {
    const res = await pricingService.deletePlan(id, token);
    if (!res.ok) throw new Error('Failed to delete plan');
    await fetchData('pricing');
  };

  const getAuthHeaders = useCallback(async (json = false) => {
    const s = await session();
    const token = s.getIdToken().getJwtToken();
    return json
      ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      : { 'Authorization': `Bearer ${token}` };
  }, [session]);

  const fetchData = useCallback(async (tab) => {
    setLoading(true);
    setError('');
    let isMounted = true;
    
    try {
      const headers = await getAuthHeaders();

      if (tab === 'members') {
        const res = await fetch(getApiUrl('/admin/members'), { headers });
        if (!res.ok) throw new Error('Failed to load members');
        const data = await res.json();
        if (isMounted) setUsers(data || []);
      } else if (tab === 'trainers') {
        const res = await fetch(getApiUrl('/admin/trainers'), { headers });
        if (!res.ok) throw new Error('Failed to load trainers');
        const data = await res.json();
        if (isMounted) setTrainers(data || []);
      } else if (tab === 'pricing') {
        const res = await fetch(getApiUrl('/admin/prices'), { headers });
        if (!res.ok) throw new Error('Failed to load pricing');
        const data = await res.json();
        if (isMounted) setPrices(data || []);
      } else if (tab === 'configs') {
        const res = await fetch(getApiUrl("/config"), { headers });
        if (!res.ok) throw new Error("Failed to fetch config");
        const data = await res.json();
        const resolvedData = data || {};
        if (isMounted) {
          setConfigs(resolvedData);
          setConfigForm({
            whatsapp: resolvedData.whatsapp || '',
            phone: resolvedData.phone || '',
            email: resolvedData.email || '',
            address: resolvedData.address || '',
            mapsLink: resolvedData.mapsLink || ''
          });
        }
      }
    } catch (e) {
      const errorResult = handleApiError(e);
      if (isMounted) {
        setError(errorResult.error);
        
        // Use static arrays to prevent undefined error crashes
        if (tab === 'members') {
          setUsers([]);
        } else if (tab === 'trainers') {
          setTrainers([
            { id: 1, name: 'John Doe', specialty: 'Strength Training', experience: '5 years', imageUrl: '' },
            { id: 2, name: 'Jane Smith', specialty: 'Cardio', experience: '3 years', imageUrl: '' }
          ]);
        } else if (tab === 'pricing') {
          setPrices([
            { id: 1, title: 'Basic Plan', price: '$29', duration: '/month', features: ['Gym Access', 'Basic Equipment'], isPopular: false },
            { id: 2, title: 'Premium Plan', price: '$49', duration: '/month', features: ['Gym Access', 'All Equipment', 'Personal Training'], isPopular: true }
          ]);
        }
      }
    } finally {
      if (isMounted) setLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [getAuthHeaders, getApiUrl]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(getApiUrl(`/admin/users/${id}`), { method: 'DELETE', headers: await getAuthHeaders() });
      setUsers(users.filter(u => u._id !== id));
    } catch (e) {
      // Error deleting user - handled silently
    }
  };

  
  const deleteTrainer = async (id) => {
    if (!window.confirm("Delete trainer?")) return;
    try {
      await fetch(getApiUrl(`/admin/trainers/${id}`), { method: 'DELETE', headers: await getAuthHeaders() });
      setTrainers(trainers.filter(t => t._id !== id));
    } catch (e) {
      // Error deleting trainer - handled silently
    }
  };

  const savePrice = async (e) => {
    e.preventDefault();
    try {
      const method = priceForm.id ? 'PUT' : 'POST';
      const url = priceForm.id ? getApiUrl(`/admin/prices/${priceForm.id}`) : getApiUrl(`/admin/prices`);
      const payload = {
        ...priceForm,
        features: Array.isArray(priceForm.features) ? priceForm.features : priceForm.features.split(',').map(f => f.trim())
      };
      const res = await fetch(url, {
        method,
        headers: await getAuthHeaders(true),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setPriceForm({ id: null, title: '', price: '', duration: '/month', features: '', isPopular: false });
        fetchData('pricing');
      }
    } catch (e) {
      // Error saving price - handled silently
    }
  };

  const deletePrice = async (id) => {
    if (!window.confirm("Delete rating plan?")) return;
    try {
      await fetch(getApiUrl(`/admin/prices/${id}`), { method: 'DELETE', headers: await getAuthHeaders() });
      setPrices(prices.filter(p => p._id !== id));
    } catch (e) {
      // Error deleting price - handled silently
    }
  };

  const saveConfigs = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const s = await session();
      const token = s.getIdToken().getJwtToken();
      const res = await contentService.updateConfig(configForm, token);
      if (!res.ok) {
         let errMsg = 'Failed to save config';
         try {
           const errData = await res.json();
           errMsg = errData.error || errData.message || errMsg;
         } catch(err) {}
         throw new Error(errMsg);
      }
      alert('Settings updated successfully');
      
      // Update global config instantly across the app without reloading
      if (refreshConfig) await refreshConfig();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update configurations.');
      setError('Failed to save configurations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminPage">
      <div className="adminContainer">
        <div className="adminHeaderFlex">
          <h2>Dashboard</h2>
        </div>

        <div className="adminTabs">
          <button type="button" className={`adminTab${activeTab === 'members' ? ' active' : ''}`} onClick={() => setActiveTab('members')}>Members ({users.length || 0})</button>
          <button type="button" className={`adminTab${activeTab === 'trainers' ? ' active' : ''}`} onClick={() => setActiveTab('trainers')}>Trainers</button>
          <button type="button" className={`adminTab${activeTab === 'pricing' ? ' active' : ''}`} onClick={() => setActiveTab('pricing')}>Pricing</button>
          <button type="button" className={`adminTab${activeTab === 'configs' ? ' active' : ''}`} onClick={() => setActiveTab('configs')}>Global Settings</button>
        </div>

        <div className="adminContent">
          {loading ? (
            <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>Syncing cloud data...</div>
          ) : error ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
          ) : (
            <>
              {activeTab === 'members' && (
                <div className="adminPanelSection">
                  <div className="adminHeaderActions">
                    <h3>Gym Members</h3>
                  </div>
                  {users.length ? (
                    <div className="tableResponsive">
                      <table className="adminTable">
                        <thead>
                          <tr><th>Email</th><th>Name</th><th>Role</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u._id}>
                              <td>{u.email}</td><td>{u.name || '-'}</td>
                              <td><span className={`roleBadge ${u.role}`}>{u.role}</span></td>
                              <td><button type="button" className="btnDanger" onClick={() => deleteUser(u._id)}>Remove</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>No members found</div>
                  )}
                </div>
              )}

              {activeTab === 'trainers' && (
                <div className="adminPanelSection">
                  <div className="adminHeaderActions">
                    <h3>Trainer Management</h3>
                    <button type="button" className="btnPremium" onClick={() => setIsTrainerEditorOpen(true)}>
                      Add New Trainer
                    </button>
                  </div>
                  {trainers.length ? (
                    <div className="tableResponsive">
                      <table className="adminTable">
                        <thead><tr><th>Display</th><th>Instructor</th><th>Specialty</th><th>Actions</th></tr></thead>
                        <tbody>
                          {trainers.map(t => (
                            <tr key={t._id}>
                              <td><img src={resolveImageUrl(t.image || t.imageUrl)} alt={t.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #333' }} /></td>
                              <td style={{ fontWeight: '600', color: '#fff' }}>{t.name}</td><td style={{ color: '#888' }}>{t.role || t.specialty}</td>
                              <td>
                                <button type="button" className="btnEdit" onClick={() => {
                                  setTrainerForm({ id: t._id, name: t.name, specialty: t.role || t.specialty || '', experience: t.experience || '', image: t.image || t.imageUrl || '' });
                                  setIsTrainerEditorOpen(true);
                                }}>Config</button>
                                <button type="button" className="btnDanger" onClick={() => deleteTrainer(t._id)}>Revoke</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>No trainers found</div>
                  )}
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="adminPanelSection">
                  <div className="adminHeaderActions">
                    <h3>Pricing Plans Management</h3>
                    <button type="button" className="btnPremium" onClick={() => setIsPricingEditorOpen(true)}>
                      Add New Plan
                    </button>
                  </div>
                  {prices.length ? (
                    <div className="tableResponsive">
                      <table className="adminTable">
                        <thead><tr><th>Plan Strategy</th><th>Revenue Tier</th><th>Conversion Highlight</th><th>Actions</th></tr></thead>
                        <tbody>
                          {prices.map(p => (
                          <tr key={p._id}>
                            <td style={{ fontWeight: '600', color: '#fff' }}>{p.title}</td><td style={{ color: '#10b981' }}>{p.price} <span style={{ color: '#888', fontSize: '0.8rem' }}>{p.duration}</span></td><td>{p.isPopular ? <span style={{ color: '#E63946', fontWeight: 'bold' }}>Active Focus</span> : <span style={{ color: '#444' }}>Standard</span>}</td>
                            <td>
                              <button type="button" className="btnEdit" onClick={() => {
                              setPriceForm({ id: p._id, title: p.title, price: p.price, duration: p.duration, features: p.features, isPopular: p.isPopular });
                              setIsPricingEditorOpen(true);
                            }}>Config</button>
                                <button type="button" className="btnDanger" onClick={() => deletePrice(p._id)}>Revoke</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>No pricing plans active</div>
                  )}
                </div>
              )}

              {activeTab === 'configs' && (
                <div className="adminPanelSection">
                  <form className="adminForm" onSubmit={saveConfigs}>
                    <h3>Global Platform Settings</h3>
                    <div className="dashboardGrid" style={{ gap: '15px' }}>
                      <div className="formGroup" style={{ gridColumn: 'span 6' }}>
                        <label style={{color: '#888', marginBottom: '5px', display: 'block'}}>WhatsApp Number</label>
                        <input type="text" placeholder="+1234567890" value={configForm.whatsapp} onChange={e => setConfigForm({ ...configForm, whatsapp: e.target.value })} />
                      </div>
                      <div className="formGroup" style={{ gridColumn: 'span 6' }}>
                         <label style={{color: '#888', marginBottom: '5px', display: 'block'}}>Contact Phone</label>
                         <input type="text" placeholder="1-800-GYM" value={configForm.phone} onChange={e => setConfigForm({ ...configForm, phone: e.target.value })} />
                      </div>
                      <div className="formGroup" style={{ gridColumn: 'span 12' }}>
                         <label style={{color: '#888', marginBottom: '5px', display: 'block'}}>Support Email</label>
                         <input type="email" placeholder="support@gym.com" value={configForm.email} onChange={e => setConfigForm({ ...configForm, email: e.target.value })} />
                      </div>
                      <div className="formGroup" style={{ gridColumn: 'span 12' }}>
                         <label style={{color: '#888', marginBottom: '5px', display: 'block'}}>Address</label>
                         <textarea placeholder="123 Fitness Ave" value={configForm.address} onChange={e => setConfigForm({ ...configForm, address: e.target.value })} />
                      </div>
                      <div className="formGroup" style={{ gridColumn: 'span 12' }}>
                         <label style={{color: '#888', marginBottom: '5px', display: 'block'}}>Gym Location (paste any Google Maps link or type address)</label>
                         <input type="text" placeholder="https://maps.google.com/..." value={configForm.mapsLink} onChange={e => setConfigForm({ ...configForm, mapsLink: e.target.value })} />
                      </div>
                    </div>
                    <div className="formActions" style={{marginTop: '20px'}}>
                      <button type="submit" className="btnPremium btnAdminSubmit" disabled={loading}>{loading ? "Saving..." : "Save Global Settings"}</button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AdminEditorModal
        title="Trainers"
        isOpen={isTrainerEditorOpen}
        onClose={() => {
          setIsTrainerEditorOpen(false);
          setTrainerForm({ id: null, name: '', specialty: '', experience: '', image: '' });
        }}
        items={trainers}
        schema={trainerSchema}
        onSave={handleTrainerSave}
        onDelete={handleTrainerDelete}
        initialFormData={trainerForm}
      />

      <AdminEditorModal
        title="Pricing Plans"
        isOpen={isPricingEditorOpen}
        onClose={() => {
          setIsPricingEditorOpen(false);
          setPriceForm({ id: null, title: '', price: '', duration: '/month', features: '', isPopular: false });
        }}
        items={prices}
        schema={pricingSchema}
        onSave={handlePricingSave}
        onDelete={handlePricingDelete}
        initialFormData={priceForm}
      />
    </div>
  );
};

export default AdminDashboard;
