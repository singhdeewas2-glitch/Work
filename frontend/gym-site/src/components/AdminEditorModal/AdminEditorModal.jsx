import React, { useState } from 'react';
import { FaTimes, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { uploadFileToServer } from '../../services/uploadService';

/* Admin modal: list items on the left, edit form on the right */
const AdminEditorModal = ({ title, isOpen, onClose, items = [], schema = [], onSave, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { session } = useAuth();

  if (!isOpen) return null;

  const handleSelect = (item) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setImageFile(null);
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

  const submitForm = async () => {
    setErrorMsg(null);
    for (const field of schema.filter(f => f.required && f.type !== 'image')) {
      if (!formData[field.key] || formData[field.key].toString().trim() === '') {
        return setErrorMsg(`${field.label} is required.`);
      }
    }

    setLoading(true);
    try {
      const userSession = await session();
      const token = userSession.getIdToken().getJwtToken();
      let finalImageUrl = formData.image;

      const imageField = schema.find(f => f.type === 'image');

      if (imageFile) {
        const uploadData = await uploadFileToServer(imageFile, 'admin_uploads', token);
        finalImageUrl = uploadData.url;
      }

      if (imageField && imageField.required && !finalImageUrl && !formData._id) {
        throw new Error(`${imageField.label} upload is strictly required.`);
      }

      const finalPayload = { ...formData };
      if (imageField) {
        finalPayload[imageField.key] = finalImageUrl;
      }

      await onSave(finalPayload, selectedItem._id, token);
      setSelectedItem(null);
    } catch (err) {
      setErrorMsg(err.message || 'Error saving data.');
    } finally {
      setLoading(false);
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
                  <span className="admin-modal-item-name">{item[schema.find(f => f.type === 'text' || f.type === 'string')?.key] || 'Unnamed Item'}</span>
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
                      return (
                        <div key={field.key} className="admin-modal-field admin-modal-field--full">
                          <label>{field.label} {field.required && '*'}</label>
                          <div className="admin-modal-image-row">
                            {formData[field.key] && !imageFile && (
                              <img src={formData[field.key]} alt="Preview" className="admin-modal-image-preview" />
                            )}
                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
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
                  <button type="button" className="btn btn-primary" onClick={submitForm} disabled={loading}>
                    {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditorModal;
