import React, { useState, useEffect } from 'react';
import './Transformations.css';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { uploadImageToS3 } from '../utils/uploadImage';
import axios from 'axios';

// Fallback images in case there are network issues with DB images, though DB seeded URLs are used
import fallbackBefore from '../assets/gym13.2.jpg';
import fallbackAfter from '../assets/gym13.1.jpg';

const TransformationCard = ({ item, isAdmin, onDelete, fetchTransformations }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...item });
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { session } = useAuth();

  useEffect(() => {
    setEditData({ ...item });
    setBeforeFile(null);
    setAfterFile(null);
  }, [item]);

  const handleSave = async () => {
    setErrorMsg(null);
    if (!editData.name?.trim() || !editData.story?.trim()) {
      return setErrorMsg("Name and Story are required.");
    }
    if (!item._id && !beforeFile && !editData.beforeImage) {
      return setErrorMsg("Before Image is required for new transformations.");
    }

    setLoading(true);
    try {
      const userSession = await session();
      const token = userSession.getIdToken().getJwtToken();

      const uploadImage = async (file) => {
        const uForm = new FormData();
        uForm.append('image', file);
        return await axios.post('http://localhost:8080/api/admin/upload', uForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
      };

      let finalBeforeImage = editData.beforeImage;
      let finalAfterImage = editData.afterImage;

      if (beforeFile) {
        const res1 = await uploadImage(beforeFile);
        finalBeforeImage = res1.data.url;
      }

      if (afterFile) {
        const res2 = await uploadImage(afterFile);
        finalAfterImage = res2.data.url;
      }

      if (!finalBeforeImage) throw new Error("Before image is required");

      console.log("FINAL BEFORE:", finalBeforeImage);
      console.log("FINAL AFTER:", finalAfterImage);

      const payload = {
        name: editData.name,
        story: editData.story,
        beforeImage: finalBeforeImage
      };
      
      if (finalAfterImage) {
        payload.afterImage = finalAfterImage;
      }
      
      console.log("FINAL PAYLOAD:", payload);

      const method = item._id ? 'put' : 'post';
      const url = item._id 
        ? `http://localhost:8080/api/admin/transformations/${item._id}`
        : `http://localhost:8080/api/admin/transformations`;

      const res = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchTransformations();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Network error saving transformation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item._id) {
       onDelete(item._id);
       return;
    }
    if (!window.confirm("Delete this transformation?")) return;
    try {
      const userSession = await session();
      const token = userSession.getIdToken().getJwtToken();
      const res = await fetch(`http://localhost:8080/api/admin/transformations/${item._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onDelete(item._id);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting transformation.");
    }
  };

  if (isEditing) {
    console.log("RENDER IMAGE:", item.beforeImage);
    return (
      <div className="trans-card" style={{ border: '2px solid var(--primary-color)', padding: '15px' }}>
        {errorMsg && <div style={{ color: '#ff4444', marginBottom: '10px', fontSize: '0.9rem', textAlign: 'left' }}>{errorMsg}</div>}
        <div style={{ marginBottom: '10px' }}>
          <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc'}}>Before Image:</label>
          <input type="file" accept="image/*" onChange={(e) => setBeforeFile(e.target.files[0])} style={{ width: '100%', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc'}}>After Image:</label>
          <input type="file" accept="image/*" onChange={(e) => setAfterFile(e.target.files[0])} style={{ width: '100%', boxSizing: 'border-box' }} />
        </div>
        <input className="edit-input" placeholder="Member Name" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} style={{ marginBottom: '10px', width: '100%', padding: '8px', boxSizing: 'border-box', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
        <textarea className="edit-input" placeholder="Transformation Story (e.g. Lost 10kg in 3 months)" rows="3" value={editData.story} onChange={e => setEditData({...editData, story: e.target.value})} style={{ marginBottom: '15px', width: '100%', padding: '8px', boxSizing: 'border-box', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', resize: 'vertical' }} />
        
        <div className="admin-actions" style={{ display: 'flex', gap: '8px' }}>
           <button onClick={handleSave} disabled={loading} style={{ background: 'var(--primary-color)', color: 'white', padding: '8px', border: 'none', cursor: 'pointer', borderRadius: '4px', flex: 1, fontWeight: 'bold' }}><FaSave/> {loading ? "Saving..." : "Save"}</button>
           <button onClick={() => setIsEditing(false)} style={{ background: '#444', color: 'white', padding: '8px', border: 'none', cursor: 'pointer', borderRadius: '4px', flex: 1, fontWeight: 'bold' }}><FaTimes/> Cancel</button>
        </div>
      </div>
    );
  }

  console.log("RENDER IMAGE:", item.beforeImage);
  return (
    <div className="trans-card" style={{ position: 'relative' }}>
      {isAdmin && (
         <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '5px', zIndex: 10 }}>
            <button onClick={() => setIsEditing(true)} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px' }}><FaEdit/></button>
            <button onClick={handleDelete} style={{ background: '#222', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px' }}><FaTrash/></button>
         </div>
      )}
      
      <div className="trans-image-split">
        {/* Before Image */}
        <div className="trans-img-wrapper">
          <span className="trans-badge-dark">Before</span>
          <img src={item.beforeImage || fallbackBefore} alt={`${item.name} Before`} loading="lazy" />
        </div>
        
        {/* After Image */}
        <div className="trans-img-wrapper">
          <span className="trans-badge-red">After</span>
          <img src={item.afterImage || fallbackAfter} alt={`${item.name} After`} loading="lazy" />
        </div>
      </div>
      
      <div className="trans-card-content">
        <h3 className="trans-name">{item.name}</h3>
        <p className="trans-quote">"{item.story}"</p>
      </div>
    </div>
  );
};

const Transformations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dbUser } = useAuth();
  const isAdmin = dbUser?.role === 'admin';

  useEffect(() => {
    fetchTransformations();
  }, []);

  const fetchTransformations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/transformations');
      if (response.ok) {
        const transData = await response.json();
        setData(transData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedItem, oldId) => {
    if (!oldId) {
       setData(prev => prev.map(t => t._id === undefined ? updatedItem : t));
    } else {
       setData(prev => prev.map(t => t._id === oldId ? updatedItem : t));
    }
  };

  const handleDelete = (id) => {
    setData(prev => prev.filter(t => t._id !== id));
  };
  
  const handleAddNew = () => {
    const newItem = { name: "New Member", story: "Great results here.", beforeImage: "", afterImage: "" };
    setData([...data, newItem]);
  };

  return (
    <section className="transformations-section" id="transformations">
      <div className="container">
        <h2 className="trans-section-title">
          REAL RESULTS FROM <span className="text-red">REAL MEMBERS</span>
        </h2>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading transformations...</p>
        ) : data.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No transformations available right now.</p>
        ) : (
          <div className="trans-grid">
            {data.map((item) => (
              <TransformationCard 
                 key={item._id || Math.random()} 
                 item={item}
                 isAdmin={isAdmin}
                 onDelete={handleDelete}
                 fetchTransformations={fetchTransformations}
              />
            ))}
          </div>
        )}

        {isAdmin && (
           <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button 
                 onClick={handleAddNew}
                 style={{ background: 'var(--red)', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }}>
                 + Add New Transformation
              </button>
           </div>
        )}
      </div>
    </section>
  );
};

export default Transformations;
