import React, { useState, useEffect } from 'react';
import API from '../services/api';
import publicAPI from '../services/publicApi';
import './ManageServices.css'; // Plain stylesheet asset

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', text: '' });

    // Form State Nodes
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // 1. Sync Services from Database
    const fetchServices = async () => {
        try {
            // CLEAN: publicAPI has the base /api configuration globally
            const response = await publicAPI.get('/services/all');
            setServices(response.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch service schema nodes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // 2. Submit Form (Handles both Save and Update using Multipart FormData)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setFeedback({ type: '', text: '' });

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (imageFile) {
            formData.append('file', imageFile);
        }

        try {
            if (editingId) {
                // FIXED: Stripped the double /api assignment path out
                await API.put(`/services/update/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setFeedback({ type: 'success', text: 'Service core properties updated successfully!' });
            } else {
                // FIXED: Stripped the double /api assignment path out
                await API.post('/services/add', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setFeedback({ type: 'success', text: 'New service module committed successfully!' });
            }
            resetForm();
            fetchServices();
        } catch (err) {
            console.error(err);
            setFeedback({ type: 'error', text: 'Operation aborted due to a network or schema parsing exception.' });
        } finally {
            setActionLoading(false);
        }
    };

    // 3. Edit Trigger Prep
    const handleEditInit = (service) => {
        setEditingId(service.id);
        setTitle(service.title);
        setDescription(service.description);
        setFeedback({ type: '', text: '' });
    };

    // 4. Delete/Drop Action Routine
    const handleDelete = async (id) => {
        if (!window.confirm("Are you absolutely sure you want to drop this service node permanently?")) return;
        setActionLoading(true);

        try {
            // FIXED: Stripped the double /api assignment path out
            await API.delete(`/services/delete/${id}`);
            setFeedback({ type: 'success', text: 'Service configuration dropped cleanly.' });
            if (editingId === id) resetForm();
            fetchServices();
        } catch (err) {
            console.error(err);
            setFeedback({ type: 'error', text: 'Failed to purge specific service entity record.' });
        } finally {
            setActionLoading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setImageFile(null);
        const fileInput = document.getElementById('service-file-field');
        if (fileInput) fileInput.value = '';
    };

    if (loading) {
        return (
            <div className="services-mgmt-loading">
                <div className="loading-pulse-text">Synchronizing Active Services Grid...</div>
            </div>
        );
    }

    return (
        <div className="services-mgmt-container dashboard-view-fade">
            <div className="services-mgmt-header">
                <h3>Manage Core Services & Passions</h3>
                <p>Dynamically build, update, or purge your structural competence pillars and dynamic media assets.</p>
            </div>

            <div className="services-mgmt-split-workspace">
                {/* LEFT COMPONENT COLUMN: SUBMISSION & EDITOR DESK */}
                <div className="services-mgmt-card">
                    <h4>{editingId ? '🛠️ Modify Service Properties' : '➕ Construct New Service Node'}</h4>

                    <form onSubmit={handleSubmit} className="plain-styled-form">
                        {feedback.text && (
                            <div className={`form-feedback-alert ${feedback.type}-alert`}>
                                {feedback.text}
                            </div>
                        )}

                        <div className="form-input-group">
                            <label>Service Pillar Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Full-Stack Web Applications"
                            />
                        </div>

                        <div className="form-input-group">
                            <label>Detailed Description</label>
                            <textarea
                                required
                                rows="5"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Breakdown the core stack capabilities and engineering strategies deployed..."
                            />
                        </div>

                        <div className="form-input-group">
                            <label>Media Asset Cover Image {editingId && <span className="lbl-opt-tag">(Optional unless updating image)</span>}</label>
                            <input
                                id="service-file-field"
                                type="file"
                                required={!editingId}
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        </div>

                        <div className="services-mgmt-action-bar">
                            <button type="submit" disabled={actionLoading} className="primary-action-dispatch-btn">
                                {actionLoading ? "Processing Network Payload..." : editingId ? "Commit Item Updates" : "Deploy Service Node"}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="secondary-cancel-btn">
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* RIGHT COMPONENT COLUMN: LIVE INSTANCE CARDS FEED */}
                <div className="services-display-stream">
                    <h4 className="grid-display-header-title">Active Database Service Grid Configuration</h4>

                    {services.length === 0 ? (
                        <div className="empty-services-fallback-card">
                            No active services map located inside your database schema. Complete the form to deploy your first workspace anchor.
                        </div>
                    ) : (
                        <div className="services-cards-list">
                            {services.map((service) => (
                                <div key={service.id} className="services-item-card">
                                    <div className="services-card-thumbnail">
                                        <img src={service.imageUrl} alt={service.title} />
                                    </div>

                                    <div className="services-card-info-pane">
                                        <h5>{service.title}</h5>
                                        <p>{service.description}</p>

                                        <div className="card-crud-control-row">
                                            <button onClick={() => handleEditInit(service)} className="crud-control-btn-edit">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(service.id)} className="crud-control-btn-drop">
                                                Delete
                                            </button>
                                        </div>
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

export default ManageServices;