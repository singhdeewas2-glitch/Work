import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getJson } from '../../services/httpClient';
import AdminEditorModal from '../../components/AdminEditorModal/AdminEditorModal';
import { transformationService } from '../../services/transformationService';
import { API_BASE_URL } from '../../config/apiConfig';

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

/* Admin-only list of transformation records */
const AdminTransformations = () => {
  const { session } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const transformationSchema = [
    { key: 'name', label: 'Member Name', type: 'text', required: true },
    { key: 'story', label: 'Transformation Story', type: 'textarea', required: true },
    { key: 'beforeImage', label: 'Before Image', type: 'image', required: true },
    { key: 'afterImage', label: 'After Image', type: 'image', required: false },
  ];

  const fetchTransformations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const s = await session();
      const token = s.getIdToken().getJwtToken();
      const res = await getJson('/admin/transformations', { token });
      if (!res.ok) throw new Error('Failed to fetch transformations');
      setItems(await res.json());
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [session]);

  const handleAdminSave = async (payload, id, token) => {
    let res;
    if (id) {
      res = await transformationService.updateTransformation(id, payload, token);
    } else {
      res = await transformationService.createTransformation(payload, token);
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save transformation');
    }
    await fetchTransformations();
  };

  const handleAdminDelete = async (id, token) => {
    const res = await transformationService.deleteTransformation(id, token);
    if (!res.ok) throw new Error('Failed to delete transformation');
    await fetchTransformations();
  };

  useEffect(() => {
    fetchTransformations();
  }, [fetchTransformations]);

  return (
    <div className="adminPage">
      <div className="adminContainer">
        <div className="adminHeaderFlex">
          <h2>Transformations</h2>
          <button type="button" className="btnPremium" onClick={() => setIsEditorOpen(true)}>
            Add New Transformation
          </button>
        </div>

        {loading ? (
          <div className="adminTransformationsState">Loading transformations...</div>
        ) : error ? (
          <div className="adminTransformationsState error">{error}</div>
        ) : !items.length ? (
          <div className="adminTransformationsState">No transformation data available</div>
        ) : (
          <div className="adminTransformationsGrid">
            {items.map((item) => (
              <article key={item._id} className="adminTransCard">
                <div className="adminTransImages">
                  <img src={resolveImageUrl(item.beforeImage)} alt={`${item.name} before`} />
                  <img src={resolveImageUrl(item.afterImage || item.beforeImage)} alt={`${item.name} after`} />
                </div>
                <div className="adminTransContent">
                  <h3>{item.name}</h3>
                  <p>{item.story}</p>
                  <div className="adminTransMeta">
                    <span>Progress: {item.progress}%</span>
                    <span>Duration: {item.duration}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <AdminEditorModal
        title="Transformations"
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        items={items}
        schema={transformationSchema}
        onSave={handleAdminSave}
        onDelete={handleAdminDelete}
      />
    </div>
  );
};

export default AdminTransformations;
