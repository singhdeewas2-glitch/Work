import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { uploadImageToS3 } from '../utils/uploadImage';
import './Trainers.css';

import img1 from '../assets/gym14.avif';


const TrainerCard = ({ trainer, isAdmin, onDelete, fetchTrainers }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...trainer });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { session } = useAuth();

  useEffect(() => {
    setEditData({ ...trainer });
    setImageFile(null);
  }, [trainer]);

  const handleSave = async () => {
    setErrorMsg(null);
    if (!editData.name?.trim() || !editData.role?.trim()) {
      return setErrorMsg("Name and Role are required.");
    }
    
    setLoading(true);
    try {
      const userSession = await session();
      const token = userSession.getIdToken().getJwtToken();

      let finalImageUrl = editData.image;

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        uploadFormData.append('folder', 'trainers');

        const uploadRes = await fetch('http://localhost:8080/api/admin/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadFormData
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      if (!finalImageUrl) throw new Error("Trainer Image is required");

      const payload = {
        name: editData.name,
        role: editData.role,
        experience: editData.experience,
        image: finalImageUrl
      };

      const method = trainer._id ? 'PUT' : 'POST';
      const url = trainer._id 
        ? `http://localhost:8080/api/admin/trainers/${trainer._id}`
        : `http://localhost:8080/api/admin/trainers`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        await fetchTrainers();
        setIsEditing(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || "Failed to save trainer");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error saving trainer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!trainer._id) {
       onDelete(trainer._id);
       return;
    }
    if (!window.confirm("Delete this trainer?")) return;
    try {
      const userSession = await session();
      const token = userSession.getIdToken().getJwtToken();
      const res = await fetch(`http://localhost:8080/api/admin/trainers/${trainer._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onDelete(trainer._id);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting trainer.");
    }
  };

  if (isEditing) {
    return (
      <div className="trainer-card" style={{ border: '2px solid var(--primary-color)', padding: '15px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        {errorMsg && <div style={{ color: '#ff4444', marginBottom: '10px', fontSize: '0.9rem', textAlign: 'left' }}>{errorMsg}</div>}
        <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc'}}>Trainer Image:</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ marginBottom: '15px', width: '100%', boxSizing: 'border-box' }} />
        
        <input className="edit-input" placeholder="Full Name" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} style={{ marginBottom: '10px', width: '100%', padding: '8px', boxSizing: 'border-box', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
        <input className="edit-input" placeholder="Role (e.g. Strength Training)" value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})} style={{ marginBottom: '10px', width: '100%', padding: '8px', boxSizing: 'border-box', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
        <input className="edit-input" placeholder="Experience (e.g. 5 Years)" value={editData.experience} onChange={e => setEditData({...editData, experience: e.target.value})} style={{ marginBottom: '15px', width: '100%', padding: '8px', boxSizing: 'border-box', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
        
        <div className="admin-actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
           <button onClick={handleSave} disabled={loading} style={{ background: 'var(--primary-color)', color: 'white', padding: '8px', border: 'none', cursor: 'pointer', borderRadius: '4px', flex: 1, fontWeight: 'bold' }}><FaSave/> {loading ? "Saving..." : "Save"}</button>
           <button onClick={() => setIsEditing(false)} style={{ background: '#444', color: 'white', padding: '8px', border: 'none', cursor: 'pointer', borderRadius: '4px', flex: 1, fontWeight: 'bold' }}><FaTimes/> Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="trainer-card">
      {isAdmin && (
         <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '5px', zIndex: 10 }}>
            <button onClick={() => setIsEditing(true)} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px' }}><FaEdit/></button>
            <button onClick={handleDelete} style={{ background: '#222', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px' }}><FaTrash/></button>
         </div>
      )}
      <img className="trainer-img" src={trainer.image || img1} alt={trainer.name} loading="lazy" />
      <div className="trainer-overlay">
        <h3>{trainer.name}</h3>
        <div className="trainer-specialty">{trainer.role}</div>
        <div className="trainer-exp">{trainer.experience}</div>
      </div>
    </div>
  );
};

const Trainers = () => {
  const [trainersData, setTrainersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dbUser } = useAuth();
  const isAdmin = dbUser?.role === 'admin';

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/trainers');
      if (response.ok) {
        const data = await response.json();
        setTrainersData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedTrainer, oldId) => {
    if (!oldId) {
       setTrainersData(prev => prev.map(t => t._id === undefined ? updatedTrainer : t));
    } else {
       setTrainersData(prev => prev.map(t => t._id === oldId ? updatedTrainer : t));
    }
  };

  const handleDelete = (id) => {
    setTrainersData(prev => prev.filter(t => t._id !== id));
  };
  
  const handleAddNew = () => {
    const newTrainer = { name: "New Trainer", role: "Trainer", experience: "0 years", image: "" };
    setTrainersData([...trainersData, newTrainer]);
  };

  return (
    <section className="trainers" id="trainers">
      <div className="container">
        <h2 className="section-title">Meet Our Expert<br/><span>Trainers</span></h2>
        <p className="trainers-subtitle">Certified professionals dedicated to your success</p>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading trainers...</p>
        ) : trainersData.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No trainers available.</p>
        ) : (
          <Carousel 
            items={trainersData}
            renderItem={(trainer) => (
              <TrainerCard 
                key={trainer._id || Math.random()} 
                trainer={trainer}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                fetchTrainers={fetchTrainers}
              />
            )}
          />
        )}

        {isAdmin && (
           <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                 onClick={handleAddNew}
                 style={{ background: 'var(--red)', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }}>
                 + Add New Trainer
              </button>
           </div>
        )}
      </div>
    </section>
  );
};

export default Trainers;
