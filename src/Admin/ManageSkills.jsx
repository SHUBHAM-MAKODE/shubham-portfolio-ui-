import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './ManageSkills.css';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [iconFile, setIconFile] = useState(null);

  const [form, setForm] = useState({ id: null, name: '', rating: 5 });

  const fetchSkills = async () => {
    try {
      const response = await API.get('/skills/all');
      setSkills(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch stack entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('rating', form.rating);
    if (iconFile) formData.append('file', iconFile);

    try {
      if (form.id) {
        await API.put(`/skills/update/${form.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        if (!iconFile) {
          alert("Please upload a technology logo badge.");
          setActionLoading(false);
          return;
        }
        await API.post('/skills/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert("Failed to synchronize technology metadata changes.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSelect = (skill) => {
    setForm({ id: skill.id, name: skill.name, rating: skill.rating });
    setIconFile(null);
    const fileInput = document.getElementById('skill-file-picker');
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Drop this technology node from your profile metrics?")) return;
    try {
      await API.delete(`/skills/delete/${id}`);
      fetchSkills();
      if (form.id === id) resetForm();
    } catch (err) {
      console.error(err);
      alert("Purge transaction aborted.");
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: '', rating: 5 });
    setIconFile(null);
    const fileInput = document.getElementById('skill-file-picker');
    if (fileInput) fileInput.value = '';
  };

  const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  if (loading) {
    return <div className="skills-mgmt-loading">Synchronizing Core Engine Metrics Matrix...</div>;
  }

  return (
    <div className="skills-mgmt-container dashboard-view-fade">
      <div className="skills-mgmt-header">
        <h3>Manage Core Technologies</h3>
        <p>Dynamically manage core languages, backend frameworks, and vector iconography matrices mapping.</p>
      </div>

      <div className="skills-mgmt-split-workspace">
        <div className="skills-form-card">
          <h4>{form.id ? "📝 Edit Competency Parameter" : "🚀 Deploy Technology Node"}</h4>
          <form onSubmit={handleSubmit} className="plain-styled-form">
            
            <div className="form-input-group" style={{ marginBottom: '16px' }}>
              <label>Technology / Language Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Spring Boot, Java, React" />
            </div>

            <div className="form-input-group" style={{ marginBottom: '16px' }}>
              <label>Proficiency Matrix Level: <span style={{ color: '#3b82f6', fontFamily: 'monospace' }}>{form.rating}/5 Stars</span></label>
              <input type="range" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} style={{ accentColor: '#3b82f6', cursor: 'pointer' }} />
            </div>

            <div className="form-input-group" style={{ marginBottom: '24px' }}>
              <label>Vector Icon Badge {form.id && <span style={{ fontSize: '11px', color: '#64748b' }}>(Optional update)</span>}</label>
              <input id="skill-file-picker" type="file" required={!form.id} accept="image/*" onChange={(e) => setIconFile(e.target.files[0])} />
            </div>

            <div className="form-execution-action-bar">
              <button type="submit" disabled={actionLoading} className="primary-action-dispatch-btn">
                {actionLoading ? "Processing..." : form.id ? "Save Settings" : "Deploy Skill Badge"}
              </button>
              {form.id && <button type="button" onClick={resetForm} className="secondary-cancel-btn">Cancel</button>}
            </div>
          </form>
        </div>

        <div className="skills-display-stream">
          <h4 className="grid-display-header-title">Active Competency Registries ({skills.length})</h4>
          {skills.length === 0 ? (
            <div className="empty-table-fallback-card">No competence arrays populated.</div>
          ) : (
            <div className="skills-cards-grid-layout">
              {skills.map((skill) => (
                <div key={skill.id} className="skill-item-row-card">
                  <div className="skill-card-left-identity">
                    <div className="skill-avatar-frame">
                      <img src={skill.iconUrl} alt={skill.name} />
                    </div>
                    <div>
                      <h5>{skill.name}</h5>
                      <span className="stars-lbl-mono">{renderStars(skill.rating)}</span>
                    </div>
                  </div>
                  <div className="card-administrative-actions-row" style={{ marginTop: 0, gap: '6px' }}>
                    <button onClick={() => handleEditSelect(skill)} className="crud-control-btn-edit" style={{ padding: '4px 10px', fontSize: '12px' }}>Edit</button>
                    <button onClick={() => handleDelete(skill.id)} className="crud-control-btn-delete" style={{ padding: '4px 10px', fontSize: '12px' }}>Drop</button>
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

export default ManageSkills;