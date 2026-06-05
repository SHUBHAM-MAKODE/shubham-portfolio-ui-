import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './ManageExperience.css'; // Linking our dedicated plain CSS file

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // Explicit state handler for binary files

  // Form State Layout
  const [form, setForm] = useState({
    id: null,
    company: '',
    role: '',
    duration: '',
    location: '',
    descriptionPoints: [''], // State array handling dynamic descriptors
    companyLogoUrl: '',
    companyLogoPublicId: ''
  });

  const fetchExperiences = async () => {
    try {
      const response = await API.get('/experiences/all');
      // Read our custom ResponseStructure data payload list wrapper safely
      setExperiences(response.data?.data || []);
    } catch (err) {
      console.error("Failed to sync experience collection node:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // --- Dynamic Description Bullet Handlers ---
  const handlePointChange = (index, value) => {
    const updatedPoints = [...form.descriptionPoints];
    updatedPoints[index] = value;
    setForm(prev => ({ ...prev, descriptionPoints: updatedPoints }));
  };

  const addPointField = () => {
    setForm(prev => ({ ...prev, descriptionPoints: [...prev.descriptionPoints, ''] }));
  };

  const removePointField = (index) => {
    if (form.descriptionPoints.length === 1) return;
    const updatedPoints = form.descriptionPoints.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, descriptionPoints: updatedPoints }));
  };

  // --- Submit Pipeline (Handles Multipart Form Data to match your Controller parameters) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    // Filter out trailing empty descriptor string cells before shipping
    const cleanedPoints = form.descriptionPoints.filter(p => p.trim() !== '');
    if (cleanedPoints.length === 0) {
      alert("Please enter at least one accomplishment description bullet point.");
      setActionLoading(false);
      return;
    }

    // Convert payload map into multi-part form rows so Spring MVC parses it seamlessly
    const formData = new FormData();
    formData.append('company', form.company);
    formData.append('role', form.role);
    formData.append('duration', form.duration);
    formData.append('location', form.location);

    // Append array contents cleanly to let Spring MVC bind to List<String> natively
    cleanedPoints.forEach(pt => formData.append('descriptionPoints', pt));

    // Append file stream chunk if the administrator selected a logo
    if (logoFile) {
      formData.append('file', logoFile);
    }

    try {
      if (form.id) {
        // Multi-part context transaction update route
        await API.put(`/experiences/update/${form.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Multi-part context transaction submission route
        await API.post('/experiences/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      fetchExperiences();
    } catch (err) {
      console.error("Mutation failed:", err);
      alert("Failed to commit experience transaction block.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSelect = (item) => {
    setForm({
      id: item.id,
      company: item.company,
      role: item.role,
      duration: item.duration,
      location: item.location || '',
      descriptionPoints: item.descriptionPoints && item.descriptionPoints.length > 0 ? item.descriptionPoints : [''],
      companyLogoUrl: item.companyLogoUrl || '',
      companyLogoPublicId: item.companyLogoPublicId || ''
    });
    setLogoFile(null); // Reset local file picker choice on cell context shift
    const fileInput = document.getElementById('logo-file-picker');
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently erase this career milestone record?")) return;
    try {
      await API.delete(`/experiences/delete/${id}`);
      fetchExperiences();
      if (form.id === id) resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to drop experience entity row.");
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      company: '',
      role: '',
      duration: '',
      location: '',
      descriptionPoints: [''],
      companyLogoUrl: '',
      companyLogoPublicId: ''
    });
    setLogoFile(null);
    const fileInput = document.getElementById('logo-file-picker');
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return (
      <div className="timeline-loading-wrapper">
        <div className="loading-pulse-text">Syncing Corporate History Nodes...</div>
      </div>
    );
  }

  return (
    <div className="timeline-panel-container dashboard-view-fade">

      <div className="timeline-header-block">
        <h3>Experience Timeline Builder</h3>
        <p>Configure, append, and update interactive resume career timeline data packets directly within PostgreSQL.</p>
      </div>

      <div className="timeline-split-workspace">

        {/* LEFT COLUMN: MANAGEMENT INPUT CONTROL FORM */}
        <div className="timeline-form-card">
          <h4 className="form-action-title">
            {form.id ? "📝 Edit Career Milestone" : "🚀 Create Timeline Segment"}
          </h4>

          <form onSubmit={handleSubmit} className="plain-styled-form">
            <div className="form-group-row">
              <div className="single-input-wrapper">
                <label>Company Entity</label>
                <input type="text" name="company" required value={form.company} onChange={handleInputChange} placeholder="e.g. JSpiders" />
              </div>
              <div className="single-input-wrapper">
                <label>Professional Role</label>
                <input type="text" name="role" required value={form.role} onChange={handleInputChange} placeholder="e.g. Java Intern" />
              </div>
            </div>

            <div className="form-group-row">
              <div className="single-input-wrapper">
                <label>Duration Window</label>
                <input type="text" name="duration" required value={form.duration} onChange={handleInputChange} placeholder="e.g. Sept 2025 - Present" />
              </div>
              <div className="single-input-wrapper">
                <label>Geographic Location</label>
                <input type="text" name="location" required value={form.location} onChange={handleInputChange} placeholder="e.g. Bengaluru, India" />
              </div>
            </div>

            {/* Media Asset Cloudinary File Target Element Row */}
            <div className="single-input-wrapper" style={{ marginBottom: '20px' }}>
              <label>Company Logo {form.id && <span style={{ fontSize: '11px', color: '#64748b' }}>(Optional update)</span>}</label>
              <input
                id="logo-file-picker"
                type="file"
                required={!form.id}
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </div>

            {/* Dynamic Accomplishment Streams */}
            <div className="dynamic-points-wrapper">
              <label className="points-master-label">Core Accomplishments / Description Points</label>

              <div className="points-inputs-list">
                {form.descriptionPoints.map((point, index) => (
                  <div key={index} className="point-input-row">
                    <input
                      type="text"
                      required
                      value={point}
                      onChange={(e) => handlePointChange(index, e.target.value)}
                      placeholder={`Accomplishment item #${index + 1}`}
                    />
                    {form.descriptionPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePointField(index)}
                        className="remove-point-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addPointField}
                className="add-point-field-trigger"
              >
                ＋ Add New Bullet Descriptor
              </button>
            </div>

            <div className="form-execution-action-bar">
              <button type="submit" disabled={actionLoading} className="primary-action-dispatch-btn">
                {actionLoading ? "Executing Operation..." : form.id ? "Commit Updates" : "Publish to Timeline"}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm} className="secondary-cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: ACTIVE RECORD LIST VIEW */}
        <div className="timeline-display-stream">
          <h4 className="grid-display-header-title">Active Database Timeline Mappings</h4>

          {experiences.length === 0 ? (
            <div className="empty-table-fallback-card">
              No structural items configured inside table schema. Use the builder utility to publish cards.
            </div>
          ) : (
            <div className="timeline-cards-list">
              {experiences.map((item) => (
                <div key={item.id} className="timeline-item-card">

                  <div className="timeline-card-main-body">
                    <div className="timeline-card-title-row">
                      {item.companyLogoUrl && (
                        <div className="timeline-card-logo-preview" style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', marginRight: '12px', border: '1px solid #1e293b', flexShrink: 0 }}>
                          <img src={item.companyLogoUrl} alt={item.company} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div>
                        <h5>{item.role}</h5>
                        <span className="company-tag-mono">@ {item.company}</span>
                      </div>
                    </div>

                    <div className="timeline-card-subtext-metadata" style={{ marginTop: '10px' }}>
                      <span>🗓️ {item.duration}</span>
                      <span style={{ marginLeft: '12px' }}>📍 {item.location}</span>
                    </div>

                    <ul className="timeline-bullets-list">
                      {item.descriptionPoints && item.descriptionPoints.map((pt, index) => (
                        <li key={index}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-administrative-actions-row">
                    <button onClick={() => handleEditSelect(item)} className="crud-control-btn-edit">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="crud-control-btn-delete">Drop</button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageExperience;