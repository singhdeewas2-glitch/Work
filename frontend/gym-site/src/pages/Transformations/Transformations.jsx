import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminEditorModal from '../../components/AdminEditorModal/AdminEditorModal';

import fallbackBefore from '../../assets/gym13.2.jpg';
import fallbackAfter from '../../assets/gym13.1.jpg';

const TransformationCard = ({ item }) => {
  return (
    <div className="trans-card">
      <div className="transImageSplit">
        <div className="transImgWrapper">
          <span className="transBadgeDark">Before</span>
          <img src={item.beforeImage || fallbackBefore} alt={`${item.name} Before`} loading="lazy" />
        </div>
        <div className="transImgWrapper">
          <span className="transBadgeRed">After</span>
          <img src={item.afterImage || fallbackAfter} alt={`${item.name} After`} loading="lazy" />
        </div>
      </div>

      <div className="transCardContent">
        <h3 className="transName">{item.name}</h3>
        <p className="transQuote">&quot;{item.story}&quot;</p>
      </div>
    </div>
  );
};

/* Success stories: used on home and /success-stories */
const Transformations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { user, dbUser } = useAuth();
  const groups = user?.signInUserSession?.accessToken?.payload?.["cognito:groups"];
  console.log("Transformations groups:", groups);
  const isAdmin = groups?.includes("admins") || dbUser?.role === 'admin';

  const schema = [
    { key: 'name', label: 'Member Name', type: 'text', required: true },
    { key: 'story', label: 'Transformation Story', type: 'textarea', required: true },
    { key: 'beforeImage', label: 'Before Image', type: 'image', required: true },
    { key: 'afterImage', label: 'After Image', type: 'image', required: false },
  ];

  useEffect(() => {
    fetchTransformations();
  }, []);

  const fetchTransformations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/transformations');
      if (response.ok) {
        const transData = await response.json();
        setData(transData);
      }
    } catch (err) {
      // Transformations fetch error - handled by UI state
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSave = async (payload, id, token) => {
    const method = id ? 'PUT' : 'POST';
    const url = id
      ? `http://localhost:8080/api/admin/transformations/${id}`
      : 'http://localhost:8080/api/admin/transformations';

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
      throw new Error(errData.error || 'Failed to save transformation');
    }
    await fetchTransformations();
  };

  const handleAdminDelete = async (id, token) => {
    const res = await fetch(`http://localhost:8080/api/admin/transformations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete transformation');
    await fetchTransformations();
  };

  return (
    <section className="transformationsSection" id="transformations">
      <div className="container">
        <div className="admin-toolbar admin-toolbar--flush">
          {isAdmin && (
            <button type="button" onClick={() => setIsEditorOpen(true)} className="btn btn-outline btn-compact">
              Edit
            </button>
          )}
        </div>

        <h2 className="transSectionTitle">
          REAL RESULTS FROM <span className="textRed">REAL MEMBERS</span>
        </h2>

        {loading ? (
          <p className="page-hint">Loading transformations...</p>
        ) : data.length === 0 ? (
          <p className="page-hint">No transformations available right now.</p>
        ) : (
          <div className="transGrid">
            {data.map((item) => (
              <TransformationCard
                key={item._id || Math.random()}
                item={item}
              />
            ))}
          </div>
        )}
      </div>

      <AdminEditorModal
        title="Transformations"
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        items={data}
        schema={schema}
        onSave={handleAdminSave}
        onDelete={handleAdminDelete}
      />
    </section>
  );
};

export default Transformations;
