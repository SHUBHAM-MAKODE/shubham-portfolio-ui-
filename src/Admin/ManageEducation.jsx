import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './ManageEducation.css';

const ManageEducation = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    degree: '',
    institution: '',
    location: '',
    duration: '',
    grade: '',
    details: ['']
  });

  const fetchEducation = async () => {
    try {
      const response = await API.get('/education/all');
      setEducationList(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch academic tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (index, value) => {
    const updatedDetails = [...form.details];
    updatedDetails[index] = value;
    setForm(prev => ({ ...prev, details: updatedDetails }));
  };

  const addDetailField = () => {
    setForm(prev => ({ ...prev, details: [...prev.details, ''] }));
  };

  const removeDetailField = (index) => {
    if (form.details.length === 1) return;
    setForm(prev => ({ ...prev, details: prev.details.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const cleanedDetails = form.details.filter(d => d.trim() !== '');

    const payload = {
      degree: form.degree,
      institution: form.institution,
      location: form.location,
      duration: form.duration,
      grade: form.grade,
      details: cleanedDetails
    };

    try {
      if (form.id) {
        await API.put(`/education/update/${form.id}`, payload);
      } else {
        await API.post('/education/add', payload);
      }
      resetForm();
      fetchEducation();
    } catch (err) {
      console.error(err);
      alert("Failed to commit transaction.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSelect = (item) => {
    setForm({
      id: item.id,
      degree: item.degree,
      institution: item.institution,
      location: item.location,
      duration: item.duration,
      grade: item.grade,
      details: item.details && item.details.length > 0 ? item.details : ['']
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently erase this education record?")) return;
    try {
      await API.delete(`/education/delete/${id}`);
      fetchEducation();
      if (form.id === id) resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to drop record.");
    }
  };

  const resetForm = () => {
    setForm({ id: null, degree: '', institution: '', location: '', duration: '', grade: '', details: [''] });
  };

  if (loading) {
    return <div className="edu-mgmt-loading">Synchronizing Academic History Nodes...</div>;
  }

  return (
    <div className="edu-mgmt-container dashboard-view-fade">
      <div className="edu-mgmt-header">
        <h3>Manage Education Timeline</h3>
        <p>Dynamically control the credentials displayed on your public accordion timeline.</p>
      </div>

      <div className="edu-mgmt-split-workspace">
        <div className="edu-form-card">
          <h4>{form.id ? "📝 Modify Academic Record" : "🚀 Add Degree Record"}</h4>
          <form onSubmit={handleSubmit} className="plain-styled-form">
            
            <div className="form-group-row">
              <div className="single-input-wrapper">
                <label>Degree / Certificate</label>
                <input type="text" name="degree" required value={form.degree} onChange={handleInputChange} placeholder="e.g. B.Tech in CSE" />
              </div>
              <div className="single-input-wrapper">
                <label>Institution / University</label>
                <input type="text" name="institution" required value={form.institution} onChange={handleInputChange} placeholder="e.g. OIST" />
              </div>
            </div>

            <div className="form-group-row">
              <div className="single-input-wrapper">
                <label>Duration Window</label>
                <input type="text" name="duration" required value={form.duration} onChange={handleInputChange} placeholder="e.g. 2020 - 2024" />
              </div>
              <div className="single-input-wrapper">
                <label>Location</label>
                <input type="text" name="location" required value={form.location} onChange={handleInputChange} placeholder="e.g. Bhopal, MP" />
              </div>
            </div>

            <div className="single-input-wrapper" style={{ marginBottom: '20px' }}>
              <label>Status / Grade</label>
              <input type="text" name="grade" required value={form.grade} onChange={handleInputChange} placeholder="e.g. Graduated, Pursuing, 8.5 CGPA" />
            </div>

            <div className="dynamic-points-wrapper">
              <label className="points-master-label">Specializations / Scope Parameters</label>
              {form.details.map((detail, index) => (
                <div key={index} className="point-input-row">
                  <input type="text" required value={detail} onChange={(e) => handleDetailChange(index, e.target.value)} placeholder={`Scope point #${index + 1}`} />
                  {form.details.length > 1 && (
                    <button type="button" onClick={() => removeDetailField(index)} className="remove-point-btn">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addDetailField} className="add-point-field-trigger">＋ Append Scope Line</button>
            </div>

            <div className="form-execution-action-bar">
              <button type="submit" disabled={actionLoading} className="primary-action-dispatch-btn">
                {actionLoading ? "Processing..." : form.id ? "Commit Updates" : "Publish Record"}
              </button>
              {form.id && <button type="button" onClick={resetForm} className="secondary-cancel-btn">Cancel</button>}
            </div>
          </form>
        </div>

        <div className="edu-display-stream">
          <h4 className="grid-display-header-title">Active Database Mappings</h4>
          {educationList.length === 0 ? (
            <div className="empty-table-fallback-card">No academic history records stored.</div>
          ) : (
            <div className="edu-cards-list">
              {educationList.map((item) => (
                <div key={item.id} className="edu-item-card">
                  <div className="edu-card-main-body">
                    <h5>{item.degree}</h5>
                    <span className="inst-lbl">{item.institution} ({item.location})</span>
                    <div className="meta-row"><span>🗓️ {item.duration}</span><span>🎓 Status: {item.grade}</span></div>
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

export default ManageEducation;