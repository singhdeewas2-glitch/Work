import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getJson } from '../../services/httpClient';

/* Admin-only list of transformation records */
const AdminTransformations = () => {
  const { session } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchTransformations();
  }, [fetchTransformations]);

  return (
    <div className="adminPage">
      <div className="adminContainer">
        <div className="adminHeaderFlex">
          <h2>Transformations</h2>
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
                  <img src={item.beforeImage} alt={`${item.name} before`} />
                  <img src={item.afterImage || item.beforeImage} alt={`${item.name} after`} />
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
    </div>
  );
};

export default AdminTransformations;
