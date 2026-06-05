import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './ManageHero.css'; // Linking our custom plain stylesheet

const ManageHero = () => {
  const [roles, setRoles] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // 1. Sync current roles from database upon component load
  const fetchCurrentRoles = async () => {
    try {
      const response = await API.get('/admin/profile');
      // Read from our safe PublicProfileDto layout: data.roles
      const existingRoles = response.data?.data?.roles || [];
      if (existingRoles.length > 0) {
        setRoles(existingRoles);
      } else {
        setRoles(['']); // Default fallback for a blank initialization card
      }
    } catch (err) {
      console.error("Failed to fetch dashboard hero metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentRoles();
  }, []);

  // 2. Dynamic Array Field State Handlers (Form Sync)
  const handleRoleChange = (index, value) => {
    const updated = [...roles];
    updated[index] = value;
    setRoles(updated);
  };

  const addRoleField = () => {
    setRoles(prev => [...prev, '']);
  };

  const removeRoleField = (index) => {
    if (roles.length === 1) return;
    setRoles(prev => prev.filter((_, i) => i !== index));
  };

  // 3. Submit mutated string arrays to backend via authenticated PUT request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedback({ type: '', text: '' });

    // Clean out empty inputs before shipping arrays over network channels
    const payload = roles.filter(r => r.trim() !== '');

    try {
      const response = await API.put('/admin/update-roles', payload);
      if (response.data?.status === 200) {
        setFeedback({ type: 'success', text: 'Hero designations committed and synchronized cleanly!' });
        if (response.data?.data?.roles) {
          setRoles(response.data.data.roles);
        }
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', text: 'Failed to update administrative designations matrix.' });
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Individual Inline Drop/Delete Core Handler
  const handleDeleteRoleItem = async (roleToDelete) => {
    if (!window.confirm(`Are you sure you want to drop "${roleToDelete}" from your scrolling landing text arrays?`)) return;
    
    setActionLoading(true);
    setFeedback({ type: '', text: '' });

    // Filter out the single designated string element from our state match list
    const updatedPayload = roles.filter(role => role !== roleToDelete);
    
    // Safety Fallback: If we drop the last item, ensure an empty field placeholder remains
    const cleanPayload = updatedPayload.length > 0 ? updatedPayload : [''];

    try {
      const response = await API.put('/admin/update-roles', cleanPayload);
      if (response.data?.status === 200) {
        setFeedback({ type: 'success', text: 'Designation removed and schema updated successfully.' });
        setRoles(cleanPayload);
      }
    } catch (err) {
      console.error("Failed to drop role entry node:", err);
      setFeedback({ type: 'error', text: 'Failed to execute drop mutation on collection array.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="hero-mgmt-loading">
        <div className="loading-pulse-text">Synchronizing Hero Node Configuration...</div>
      </div>
    );
  }

  return (
    <div className="hero-mgmt-container dashboard-view-fade">
      <div className="hero-mgmt-header">
        <h3>Manage Hero Typist Strings</h3>
        <p>Dynamically update the designations string array scrolling on the home page hero workspace.</p>
      </div>

      {/* TWO-COLUMN GRID WORKSPACE LAYOUT SPLIT */}
      <div className="hero-mgmt-split-workspace">
        
        {/* LEFT COLUMN: EDIT CONTROL INPUT CARD */}
        <div className="hero-mgmt-card">
          <h4>🚀 Configure Rotating Designations</h4>
          
          <form onSubmit={handleSubmit} className="plain-styled-form">
            {feedback.text && (
              <div className={`form-feedback-alert ${feedback.type}-alert`}>
                {feedback.text}
              </div>
            )}

            <div className="dynamic-roles-list">
              <label>Active Professional Designations</label>
              
              {roles.map((role, index) => (
                <div key={index} className="role-input-row">
                  <span className="role-index-lbl">#{index + 1}</span>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                    placeholder="e.g. Full Stack Developer (Java)"
                  />
                  {roles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoleField(index)}
                      className="remove-role-field-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRoleField}
              className="add-role-field-trigger"
            >
              ＋ Add New Designation Line
            </button>

            <div className="hero-mgmt-action-bar">
              <button type="submit" disabled={actionLoading} className="primary-action-dispatch-btn">
                {actionLoading ? "Updating Schema..." : "Commit Global Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: ACTIVE RECORD LIST STREAM VIEW */}
        <div className="hero-display-stream">
          <h4 className="grid-display-header-title">Active Database Element Array Mappings</h4>
          
          {roles.length === 0 || (roles.length === 1 && roles[0] === '') ? (
            <div className="empty-roles-fallback-card">
              No designations active in database. Use the manager input configuration utility on the left to write text objects.
            </div>
          ) : (
            <div className="hero-cards-list">
              {roles.map((role, index) => (
                <div key={index} className="hero-item-card">
                  <div className="hero-card-main-body">
                    <span className="hero-badge-mono">Sequence Node #{index + 1}</span>
                    <h5 className="hero-role-display-text">{role}</h5>
                  </div>
                  
                  <div className="card-administrative-actions-row">
                    <button 
                      onClick={() => handleDeleteRoleItem(role)} 
                      disabled={actionLoading}
                      className="crud-control-btn-drop"
                    >
                      Drop
                    </button>
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

export default ManageHero;