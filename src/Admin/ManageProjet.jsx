import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './ManageProjects.css'; // Linking our plain CSS file

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Core Form State Mappings
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    techStack: '', // Managed as a comma-separated text box locally
    liveUrl: '',
    gitHubUrl: ''
  });

  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects/all');
      setProjects(response.data?.data || []);
    } catch (err) {
      // console.error("Failed to sync project collection node:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // --- Submit Pipeline (Handles Multipart File Dispatches) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('techStack', form.techStack);
    formData.append('liveUrl', form.liveUrl);
    formData.append('gitHubUrl', form.gitHubUrl);

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      if (form.id) {
        // console.log(63)
        // PUT multi-part update track
        await API.put(`/projects/update/${form.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // console.log(69)
        // POST secure creation pass
        if (!selectedFile) {
          alert("Please upload a display mockup or screenshot asset file.");
          setActionLoading(false);
          return;
        }
        // console.log(76)
        await API.post('/projects/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      // console.error("Project asset persistence execution failure:", err);
      alert("Failed to commit project records compilation step.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSelect = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      // Map incoming string arrays back into clean user-editable strings
      techStack: Array.isArray(item.techStack) ? item.techStack.join(', ') : item.techStack || '',
      liveUrl: item.liveUrl || '',
      gitHubUrl: item.gitHubUrl || ''
    });
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this repository project component?")) return;
    try {
      await API.delete(`/projects/delete/${id}`);
      fetchProjects();
      if (form.id === id) resetForm();
    } catch (err) {
      // console.error(err);
      alert("Failed to drop database project row.");
    }
  };

  const resetForm = () => {
    setForm({ id: null, title: '', description: '', techStack: '', liveUrl: '', gitHubUrl: '' });
    setSelectedFile(null);
    const fileInput = document.getElementById('project-file-input');
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return (
      <div className="project-loading-wrapper">
        <div className="loading-pulse-text">Syncing Active Project Nodes...</div>
      </div>
    );
  }

  return (
    <div className="project-panel-container dashboard-view-fade">

      <div className="project-header-block">
        <h3>Project Repository Portfolio</h3>
        <p>Publish full production applications, wire target GitHub code links, and distribute media assets across the CDN infrastructure.</p>
      </div>

      <div className="project-split-workspace">

        {/* LEFT DECK: THE ARCHITECTURAL CAPTURE FORM */}
        <div className="project-form-card">
          <h4 className="form-action-title">
            {form.id ? "📝 Edit Repository Item" : "📁 Deploy New Project Entry"}
          </h4>

          <form onSubmit={handleSubmit} className="plain-styled-form">
            <div className="single-input-wrapper">
              <label>Application Title</label>
              <input type="text" name="title" required value={form.title} onChange={handleInputChange} placeholder="e.g. FoodExpress Delivery" />
            </div>

            <div className="single-input-wrapper">
              <label>Project Overview / Summary</label>
              <textarea name="description" required rows="4" value={form.description} onChange={handleInputChange} placeholder="Describe system architecture, roles, multi-tenant layers..." />
            </div>

            <div className="single-input-wrapper">
              <label>Technology Stack Modules (Comma-separated)</label>
              <input type="text" name="techStack" required value={form.techStack} onChange={handleInputChange} placeholder="e.g. React, Spring Boot, PostgreSQL, JWT" />
            </div>

            <div className="form-group-row">
              <div className="single-input-wrapper">
                <label>Production Live URL</label>
                <input type="text" name="liveUrl" value={form.liveUrl} onChange={handleInputChange} placeholder="https://app.com" />
              </div>
              <div className="single-input-wrapper">
                <label>GitHub Source Path</label>
                <input type="text" name="gitHubUrl" value={form.gitHubUrl} onChange={handleInputChange} placeholder="https://github.com/..." />
              </div>
            </div>

            <div className="single-input-wrapper file-upload-wrapper-box">
              <label>Display Layout Cover {form.id && "(Leave empty to keep image intact)"}</label>
              <input type="file" id="project-file-input" accept="image/*" onChange={handleFileChange} className="file-binary-selector" />
            </div>

            <div className="form-execution-action-bar">
              <button type="submit" disabled={actionLoading} className="primary-action-dispatch-btn">
                {actionLoading ? "Deploying Application..." : form.id ? "Apply System Modifications" : "Deploy Project To Cluster"}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm} className="secondary-cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT DECK: ACTIVE COMPONENT VISUAL LIST */}
        <div className="project-display-stream">
          <h4 className="grid-display-header-title">Active Database Repository Profiles</h4>

          {projects.length === 0 ? (
            <div className="empty-table-fallback-card">
              No software repository objects configured inside target database schemas. Push records with the engine desk.
            </div>
          ) : (
            <div className="project-cards-grid">
              {projects.map((item) => (
                <div key={item.id} className="project-item-card">

                  {item.imageUrl && (
                    <div className="project-card-image-box">
                      <img src={item.imageUrl} alt={item.title} />
                    </div>
                  )}

                  <div className="project-card-details-box">
                    <h5>{item.title}</h5>
                    <p className="project-description-paragraph">{item.description}</p>

                    {/* Dynamic Tech Bubble Blocks */}
                    <div className="tech-tags-flex-wrap">
                      {(Array.isArray(item.techStack) ? item.techStack : item.techStack?.split(',') || []).map((tech, idx) => (
                        <span key={idx} className="tech-chip-tag">{tech.trim()}</span>
                      ))}
                    </div>

                    <div className="project-links-metadata-row">
                      {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noreferrer" className="link-anchor-icon">🌐 Live Deployment</a>}
                      {item.gitHubUrl && <a href={item.gitHubUrl} target="_blank" rel="noreferrer" className="link-anchor-icon">💻 Code Repository</a>}
                    </div>
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

export default ManageProjects;