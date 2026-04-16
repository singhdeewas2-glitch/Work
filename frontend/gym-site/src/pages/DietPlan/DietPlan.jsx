import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Carousel from '../../components/Carousel/Carousel';
import { dietService } from '../../services/dietService';
import { API_BASE_URL } from '../../config/apiConfig';

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

const DietPlan = () => {
  const { session, dbUser, user } = useAuth();
  const [diets, setDiets] = useState({ Breakfast: [], Lunch: [], Snacks: [], Dinner: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, mealType: 'Breakfast', items: '', calories: '', notes: '', image: '' });
  const [imagePreview, setImagePreview] = useState(null);

  const groups = user?.signInUserSession?.accessToken?.payload?.["cognito:groups"];
  console.log("DietPlan groups:", groups);
  const isAdmin = groups?.includes("admins") || dbUser?.role === 'admin';

  const getValidToken = useCallback(async () => {
    try {
      const currentSession = await session();
      return currentSession.getIdToken().getJwtToken();
    } catch {
      return null;
    }
  }, [session]);

  const fetchDiets = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getValidToken();
      const response = await dietService.getDiets(token);
      if (response.ok) {
        const data = await response.json();
        const grouped = { Breakfast: [], Lunch: [], Snacks: [], Dinner: [] };
        data.forEach(diet => {
          if (grouped[diet.mealType]) grouped[diet.mealType].push(diet);
        });
        setDiets(grouped);
      }
    } catch (err) {
      // handled by UI state
    } finally {
      setLoading(false);
    }
  }, [getValidToken]);

  useEffect(() => {
    fetchDiets();
  }, [fetchDiets]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = await getValidToken();
      if (!token) return;

      const payload = { ...formData };
      if (payload.calories === '') payload.calories = null;

      let response;
      if (formData.id) {
        response = await dietService.updateDiet(formData.id, payload, token);
      } else {
        response = await dietService.createDiet(payload, token);
      }

      if (!response.ok) throw new Error('Failed to save diet plan');

      setMessage('Diet plan saved successfully.');
      setIsEditing(false);
      setFormData({ id: null, mealType: 'Breakfast', items: '', calories: '', notes: '', image: '' });
      setImagePreview(null);
      fetchDiets();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving diet plan.');
    }
  };

  const handleEdit = (diet) => {
    setFormData({
      id: diet._id,
      mealType: diet.mealType,
      items: diet.items,
      calories: diet.calories || '',
      notes: diet.notes || '',
      image: diet.image || ''
    });
    setImagePreview(resolveImageUrl(diet.image));
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this diet plan?")) return;
    try {
      const token = await getValidToken();
      if (!token) return;
      const response = await dietService.deleteDiet(id, token);
      if (response.ok) {
        setMessage('Diet plan deleted.');
        fetchDiets();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error deleting diet plan.');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setImagePreview(null);
    setFormData({ id: null, mealType: 'Breakfast', items: '', calories: '', notes: '', image: '' });
  };

  if (loading) return <div className="dietPage"><div className="diet-page-loader" /></div>;

  return (
    <div className="dietPage">
      <div className="dietHero">
        <h1>Nutrition & Diet Plan</h1>
        <p>Expert-curated macros for peak performance.</p>
      </div>

      <div className="container dietContainer">
        {message && <div className="dietMsg">{message}</div>}

        {isAdmin && !isEditing && (
          <div className="adminActions">
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <span style={{ marginRight: '8px' }}>+</span> Add Diet Plan
            </button>
          </div>
        )}

        {isAdmin && isEditing && (
          <form className="adminDietForm" onSubmit={handleSave}>
            <h3>{formData.id ? 'Edit' : 'Add'} Diet Plan</h3>
            <div className="diet-form-grid">
              <div className="diet-form-field">
                <label>Meal Type</label>
                <select name="mealType" value={formData.mealType} onChange={handleInputChange}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <div className="diet-form-field">
                <label>Calories (Optional)</label>
                <input type="number" name="calories" placeholder="e.g., 450" value={formData.calories} onChange={handleInputChange} />
              </div>
            </div>
            <div className="diet-form-field">
              <label>Food Items</label>
              <textarea name="items" placeholder="e.g., 2 Eggs, 1 Toast, Black Coffee" rows="3" required value={formData.items} onChange={handleInputChange} />
            </div>
            <div className="diet-form-grid">
              <div className="diet-form-field">
                <label>Notes (Optional)</label>
                <textarea name="notes" placeholder="e.g., Drink water 30 mins after meal" rows="2" value={formData.notes} onChange={handleInputChange} />
              </div>
              <div className="diet-form-field">
                <label>Meal Image (Optional)</label>
                <input type="file" accept="image/*" onChange={handleImageFile} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ marginTop: '10px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                )}
              </div>
            </div>

            <div className="diet-form-actions">
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        )}

        <div className="dietMealsGrid">
          {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(meal => (
            <div className={`mealSection ${meal.toLowerCase()}-bg`} key={meal}>
              <h2 className="mealTitle">{meal}</h2>
              {diets[meal].length === 0 ? (
                <p className="noDietText">No plans added yet.</p>
              ) : (
                <div className="dietCarouselWrapper">
                  <Carousel
                    items={diets[meal]}
                    renderItem={(diet) => (
                      <div className="dietCard">
                        {diet.image && (
                          <div className="dietImageWrapper">
                            <img
                              src={resolveImageUrl(diet.image)}
                              alt="Meal"
                              className="dietImage"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        )}
                        <div className="dietInfo">
                          <p className="dietItems">{diet.items}</p>
                          <div className="dietMeta">
                            {diet.calories ? <span className="metaBadge cal">{diet.calories} kcal</span> : null}
                            {diet.notes ? <span className="metaBadge notes">Note: {diet.notes}</span> : null}
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="adminControls">
                            <button className="btn btn-outline" onClick={() => handleEdit(diet)}>Edit</button>
                            <button className="btn btn-outline" style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444' }} onClick={() => handleDelete(diet._id)}>Delete</button>
                          </div>
                        )}
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
