import React, { useState, useEffect } from 'react';
import { FaCheck, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Carousel from './Carousel';
import { useAuth } from '../context/AuthContext';
import './Pricing.css';

const getWhatsAppUrl = (title) => `https://wa.me/919907076074?text=${encodeURIComponent(`Hi, I am interested in the ${title}. Please share details.`)}`;

const PricingCard = ({ plan, isAdmin, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...plan, features: plan.features.join('\n') });
  const [loading, setLoading] = useState(false);
  
  const { session } = useAuth();

  const handleSave = async () => {
    setLoading(true);
    try {
      const userSession = await session();
      const token = userSession.getIdToken().getJwtToken();
      
      const payload = {
        ...editData,
        features: editData.features.split('\n').filter(f => f.trim() !== '')
      };

      const method = plan._id ? 'PUT' : 'POST';
      const url = plan._id 
        ? `http://localhost:8080/api/admin/prices/${plan._id}`
        : `http://localhost:8080/api/admin/prices`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated, plan._id);
        setIsEditing(false);
      } else {
        alert("Failed to save pricing plan");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving pricing plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!plan._id) {
       onDelete(plan._id); // Just remove from local state if it was a new unsaved one
       return;
    }
    if (!window.confirm("Delete this plan?")) return;
    
    try {
      const userSession = await session();
      const token = userSession.getIdToken().getJwtToken();
      
      const res = await fetch(`http://localhost:8080/api/admin/prices/${plan._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        onDelete(plan._id);
      } else {
        alert("Failed to delete pricing plan");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting pricing plan.");
    }
  };

  if (isEditing) {
    return (
      <div className={`pricing-card ${editData.isPopular ? 'popular' : ''}`} style={{ border: '2px solid red' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <input className="edit-input" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{flex: 1}}>
              <label>Price:</label>
              <input className="edit-input" value={editData.price} onChange={e => setEditData({...editData, price: e.target.value})} />
            </div>
            <div style={{flex: 1}}>
              <label>Duration:</label>
              <input className="edit-input" value={editData.duration} onChange={e => setEditData({...editData, duration: e.target.value})} />
            </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Features (1 per line):</label>
          <textarea className="edit-input" rows="4" value={editData.features} onChange={e => setEditData({...editData, features: e.target.value})} />
        </div>
        <div style={{ marginBottom: '10px' }}>
           <label>
              <input type="checkbox" checked={editData.isPopular} onChange={e => setEditData({...editData, isPopular: e.target.checked})} />
              Is Popular?
           </label>
        </div>
        
        <div className="admin-actions">
           <button onClick={handleSave} disabled={loading} style={{ background: 'var(--red)', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}><FaSave/> {loading ? "..." : "Save"}</button>
           <button onClick={() => setIsEditing(false)} style={{ background: '#444', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}><FaTimes/> Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
      {isAdmin && (
         <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '5px', zIndex: 10 }}>
            <button onClick={() => setIsEditing(true)} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px' }}><FaEdit/></button>
            <button onClick={handleDelete} style={{ background: '#222', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px' }}><FaTrash/></button>
         </div>
      )}
      
      {plan.isPopular && <div className="popular-badge">Most Popular</div>}
      
      <div className="pricing-header">
        <h3>{plan.title}</h3>
        <div className="price">
          <span className="amount">{plan.price}</span>
          <span className="duration">{plan.duration}</span>
        </div>
      </div>
      
      <ul className="pricing-features">
        {plan.features?.map((feature, i) => (
          <li key={i}><FaCheck className="check-icon" /> {feature}</li>
        ))}
      </ul>
      
      <a href={getWhatsAppUrl(plan.title)} target="_blank" rel="noopener noreferrer" 
         className={`saas-btn ${plan.isPopular ? 'saas-btn-primary' : 'saas-btn-outline'}`}>
        Join Now
      </a>
    </div>
  );
};

const Pricing = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dbUser } = useAuth();
  const isAdmin = dbUser?.role === 'admin';

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/prices');
      if (response.ok) {
        const data = await response.json();
        setPricingData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedPlan, oldId) => {
    if (!oldId) {
       // it was a new item, replace the temporary one
       setPricingData(prev => prev.map(p => p._id === undefined ? updatedPlan : p));
    } else {
       setPricingData(prev => prev.map(p => p._id === oldId ? updatedPlan : p));
    }
  };

  const handleDelete = (id) => {
    setPricingData(prev => prev.filter(p => p._id !== id));
  };
  
  const handleAddNew = () => {
    const newPlan = { title: "New Plan", price: "$0", duration: "/month", features: [], isPopular: false };
    setPricingData([...pricingData, newPlan]);
  };

  return (
    <section className="pricing" id="plans">
      <div className="container">
        <h2 className="section-title">Choose Your <span>Plan</span></h2>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading plans...</p>
        ) : pricingData.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No plans available right now.</p>
        ) : (
          <Carousel 
            items={pricingData} 
            renderItem={(plan) => (
               <PricingCard 
                  key={plan._id || Math.random()} 
                  plan={plan} 
                  isAdmin={isAdmin} 
                  onUpdate={handleUpdate} 
                  onDelete={handleDelete} 
               />
            )}
          />
        )}
        
        {isAdmin && (
           <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                 onClick={handleAddNew}
                 style={{ background: 'var(--red)', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }}>
                 + Add New Plan
              </button>
           </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
