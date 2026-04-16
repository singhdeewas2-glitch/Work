import React, { useState } from 'react';
import { FaTimes, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';

// Fix relative image URLs to include backend base URL
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

const AdminEditorModal = ({ title, isOpen, onClose, items = [], schema = [], onSave, onDelete, initialFormData }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFiles, setImageFiles] = useState({}); // key -> File object (supports multiple image fields)
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { session } = useAuth();
  const { user } = useAuth();
  React.useEffect(() => {
    if (initialFormData && isOpen) {
      setSelectedItem(initialFormData);
      setFormData({ ...initialFormData });
      setImageFiles({});
      setErrorMsg(null);
    }
  }, [initialFormData, isOpen]);

  if (!isOpen) return null;

  const handleSelect = (item) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setImageFiles({});
    setErrorMsg(null);
  };

  const handleAddNew = () => {
    const newItem = schema.reduce((acc, field) => {
      acc[field.key] = field.default || (field.type === 'array' ? [] : '');
      return acc;
    }, {});
    handleSelect(newItem);
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (key, file) => {
    setImageFiles(prev => ({ ...prev, [key]: file }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    
    console.log("=== SUBMIT FUNCTION CALLED ===");
    
    if (isSubmitting) {
      console.log(" SUBMIT LOCKED: Already submitting, preventing duplicate");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg(null);
    const token = user?.signInUserSession?.idToken?.jwtToken;
    console.log("TOKEN SENT:", token);
    
    // Validate required non-image fields
    for (const field of schema.filter(f => f.required && f.type !== 'image')) {
      if (!formData[field.key] || formData[field.key].toString().trim() === '') {
        setIsSubmitting(false);
        return setErrorMsg(`${field.label} is required.`);
      }
    }

    // Validate required image fields for new items
    for (const field of schema.filter(f => f.required && f.type === 'image')) {
      if (!selectedItem._id && !imageFiles[field.key] && !formData[field.key]) {
        setIsSubmitting(false);
        return setErrorMsg(`${field.label} is required.`);
      }
    }
    
    setLoading(true);
    
    try {
      console.log("=== SUBMIT STARTING ===");
      const userSession = await session();
      const token = userSession.getIdToken().getJwtToken();

      const finalPayload = { ...formData };

      // Handle all image fields
      for (const field of schema.filter(f => f.type === 'image')) {
        if (imageFiles[field.key]) {
          console.log("Including new image file in payload:", field.key, imageFiles[field.key].name);
          finalPayload[field.key] = imageFiles[field.key]; // File object
        } else if (formData[field.key]) {
          finalPayload[field.key] = formData[field.key]; // Keep existing URL
        }
      }
      
      console.log("Final payload for save:", finalPayload);
      await onSave(finalPayload, selectedItem?._id, token);
      console.log("=== SUBMIT SUCCESSFUL ===");
      setSelectedItem(null);
      setImageFiles({});
    } catch (err) {
      console.error("AdminEditorModal submit error:", err);
      setErrorMsg(err.message || 'Error saving data.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
      console.log("=== SUBMIT COMPLETED ===");
    }
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal-panel">
        <div className="admin-modal-header">
          <h2>Manage {title}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>

        <div className="admin-modal-body">
          <div className="admin-modal-sidebar">
            <button type="button" className="btn btn-primary admin-modal-add-btn" onClick={handleAddNew}>
              <FaPlus /> Add New {title}
            </button>
            <div className="admin-modal-item-list">
              {items.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className={`admin-modal-item${selectedItem && selectedItem._id === item._id ? ' admin-modal-item--selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelect(item)}
                >
                  <span className="admin-modal-item-name">
                    {item[schema.find(f => f.type === 'text' || f.type === 'string')?.key] || 'Unnamed Item'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-modal-editor">
            {!selectedItem ? (
              <div className="admin-modal-empty">Select an item from the left or add a new one to begin editing.</div>
            ) : (
              <div className="admin-modal-form">
                <h3>{selectedItem._id ? 'Edit Item' : 'New Item'}</h3>
                {errorMsg && <div className="admin-modal-error">{errorMsg}</div>}

                <div className="admin-modal-form-grid">
                  {schema.map(field => {
                    if (field.type === 'image') {
                      const existingUrl = resolveImageUrl(formData[field.key]);
                      const previewFile = imageFiles[field.key];
                      const previewUrl = previewFile ? URL.createObjectURL(previewFile) : existingUrl;

                      return (
                        <div key={field.key} className="admin-modal-field admin-modal-field--full">
                          <label>{field.label} {field.required && '*'}</label>
                          <div className="admin-modal-image-row">
                            {previewUrl && (
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="admin-modal-image-preview"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(field.key, e.target.files[0])}
                            />
                          </div>
                        </div>
                      );
                    }

                    if (field.type === 'textarea' || field.type === 'array') {
                      return (
                        <div key={field.key} className="admin-modal-field admin-modal-field--full">
                          <label>{field.label} {field.type === 'array' && '(one per line)'} {field.required && '*'}</label>
                          <textarea
                            rows={4}
                            value={field.type === 'array' ? (formData[field.key] || []).join('\n') : (formData[field.key] || '')}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleInputChange(field.key, field.type === 'array' ? val.split('\n') : val);
                            }}
                          />
                        </div>
                      );
                    }

                    if (field.type === 'boolean') {
                      return (
                        <div key={field.key} className="admin-modal-checkbox">
                          <label>
                            <input
                              type="checkbox"
                              checked={!!formData[field.key]}
                              onChange={(e) => handleInputChange(field.key, e.target.checked)}
                            />
                            {field.label}
                          </label>
                        </div>
                      );
                    }

                    return (
                      <div key={field.key} className="admin-modal-field">
                        <label>{field.label} {field.required && '*'}</label>
                        <input
                          type="text"
                          value={formData[field.key] || ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={submitForm}>
                  <div className="admin-modal-footer-actions">
                    {selectedItem._id && onDelete && (
                      <button type="button" className="btn btn-outline admin-modal-delete-btn" onClick={async () => {
                        if (window.confirm('Are you sure?')) {
                          const userSession = await session();
                          const token = userSession.getIdToken().getJwtToken();
                          await onDelete(selectedItem._id, token);
                          setSelectedItem(null);
                        }
                      }}>
                        <FaTrash /> Delete
                      </button>
                    )}
                    <div className="admin-modal-footer-spacer" />
                    <button type="button" className="btn btn-outline" onClick={() => setSelectedItem(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading || isSubmitting}>
                      {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditorModal;
