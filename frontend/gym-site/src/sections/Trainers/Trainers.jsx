import React, { useState, useEffect } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import { useAuth } from '../../context/AuthContext';
import AdminEditorModal from '../../components/AdminEditorModal/AdminEditorModal';
import img1 from '../../assets/gym14.avif';
import './Trainers.css';

const TrainerCard = ({ trainer }) => {
  return (
    <div className="trainer-card">
      <img className="trainer-photo" src={trainer.image || img1} alt={trainer.name} loading="lazy" />
      <div className="trainer-info-overlay">
        <h3>{trainer.name}</h3>
        <div className="trainer-role">{trainer.role}</div>
        <div className="trainer-experience">{trainer.experience}</div>
      </div>
    </div>
  );
};

/* Trainers carousel / grid */
const Trainers = () => {
  const [trainersData, setTrainersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { dbUser } = useAuth();
  const isAdmin = dbUser?.role === 'admin';

  const schema = [
    { key: 'name', label: 'Trainer Name', type: 'text', required: true },
    { key: 'role', label: 'Specialty/Role', type: 'text', required: true },
    { key: 'experience', label: 'Experience (e.g. 5 Years)', type: 'text' },
    { key: 'image', label: 'Trainer Image', type: 'image', required: true },
  ];

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/trainers');
      if (response.ok) {
        const data = await response.json();
        setTrainersData(data);
      }
    } catch (err) {
      // Trainers fetch error - handled by UI state
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSave = async (payload, id, token) => {
    const method = id ? 'PUT' : 'POST';
    const url = id
      ? `http://localhost:8080/api/admin/trainers/${id}`
      : 'http://localhost:8080/api/admin/trainers';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save trainer');
    }
    await fetchTrainers();
  };

  const handleAdminDelete = async (id, token) => {
    const res = await fetch(`http://localhost:8080/api/admin/trainers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete trainer');
    await fetchTrainers();
  };

  return (
    <section className="trainers-section" id="trainers">
      <div className="container">

        <h2 className="section-title">Meet Our Expert Trainers</h2>
        <p className="trainers-intro">Certified professionals dedicated to your success</p>

        {isAdmin && (
          <div className="admin-toolbar admin-toolbar--flush">
            <button type="button" onClick={() => setIsEditorOpen(true)} className="btn btn-outline btn-compact">
              Edit
            </button>
          </div>
        )}

        {loading ? (
          <p className="page-hint">Loading trainers...</p>
        ) : trainersData.length === 0 ? (
          <p className="page-hint">No trainers available.</p>
        ) : (
          <Carousel
            items={trainersData}
            renderItem={(trainer) => (
              <TrainerCard
                key={trainer._id || Math.random()}
                trainer={trainer}
              />
            )}
          />
        )}
      </div>

      <AdminEditorModal
        title="Trainers"
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        items={trainersData}
        schema={schema}
        onSave={handleAdminSave}
        onDelete={handleAdminDelete}
      />
    </section>
  );
};

export default Trainers;
