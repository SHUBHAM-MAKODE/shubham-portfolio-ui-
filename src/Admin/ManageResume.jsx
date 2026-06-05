import React, { useState, useEffect } from 'react';
import publicAPI from '../services/publicApi';
import API from '../services/api';
import './ManageResumes.css';

const ManageResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [docUrl, setDocUrl] = useState(''); 
    const [title, setTitle] = useState('');

    const fetchResumes = async () => {
        try {
            const response = await publicAPI.get('/resumes/all');
            setResumes(response.data?.data || []);
        } catch (err) {
            console.error("Failed to sync resume document registries:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !docUrl) {
            alert("Please enter a label name and provide a valid document URL.");
            return;
        }
        setActionLoading(true);

        try {
            // Sends parameters cleanly so Spring Boot's @RequestParam can read them
            await API.post('/resumes/upload', null, {
                params: {
                    title: title,
                    url: docUrl
                }
            });
            setTitle('');
            setDocUrl(''); 
            fetchResumes();
        } catch (err) {
            console.error(err);
            alert("Failed to parse and upload document payload.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleActive = async (id) => {
        setActionLoading(true);
        try {
            await API.patch(`/resumes/set-active/${id}`);
            fetchResumes();
        } catch (err) {
            console.error(err);
            alert("Failed to alter primary document assignment state flags.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently drop this document version file from cloud storage?")) return;
        setActionLoading(true);
        try {
            await API.delete(`/resumes/delete/${id}`);
            fetchResumes();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to drop file asset.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="resume-mgmt-loading">Syncing Digital Document Cloud Repositories...</div>;
    }

    return (
        <div className="resume-mgmt-container dashboard-view-fade">
            <div style={{ marginBottom: '32px' }}>
                <h2>Resume Document Manager</h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Upload structural resume variations and dynamically switch which file visitors download on your landing page.</p>
            </div>

            <div className="resume-mgmt-split-workspace">

                {/* FORM UPLOAD DESK */}
                <div className="resume-form-card">
                    <h4>📥 Upload New Document Revision Packet</h4>
                    <form onSubmit={handleSubmit} className="plain-styled-form">
                        <div className="form-input-group" style={{ marginBottom: '16px' }}>
                            <label>Document Version Label Title</label>
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Full Stack Java Developer - Core Revision" />
                        </div>

                        <div className="form-input-group" style={{ marginBottom: '24px' }}>
                            <label>Document File URL Location</label>
                            <input 
                                type="url" 
                                required 
                                value={docUrl} 
                                onChange={(e) => setDocUrl(e.target.value)} 
                                placeholder="https://example.com/shared/my-resume.pdf" 
                            />
                        </div>

                        <button type="submit" disabled={actionLoading || !title || !docUrl} className="btn-primary-dispatch">
                            {actionLoading ? "Uploading to Cloud Storage..." : "Commit Document Release"}
                        </button>
                    </form>
                </div>

                {/* ACTIVE CLOUD ARCHIVES LIST */}
                <div className="resume-display-stream">
                    <h4 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Cloud Asset Registries Mappings</h4>

                    {resumes.length === 0 ? (
                        <div className="empty-table-fallback-card">No document packages uploaded inside database schemas yet.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {resumes.map(doc => (
                                <div key={doc.id} className={`resume-item-row-card ${doc.active ? 'active-border-highlight' : ''}`}>
                                    <div className="resume-card-left-identity">
                                        <div className="resume-avatar-frame">📄</div>
                                        <div>
                                            <h5 style={{ margin: '0 0 4px 0' }}>{doc.title}</h5>
                                            <div className="resume-meta-metrics-row">
                                                {doc.active ? (
                                                    <span className="pill-badge-active">🌟 Primary Deployment</span>
                                                ) : (
                                                    <span className="pill-badge-inactive">Draft Version Archive</span>
                                                )}
                                                <a href={doc.downloadUrl} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>Verify Link ↗</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="actions-cell-row">
                                        {!doc.active && (
                                            <button onClick={() => handleToggleActive(doc.id)} disabled={actionLoading} className="crud-btn-activate">Deploy</button>
                                        )}
                                        <button onClick={() => handleDelete(doc.id)} disabled={actionLoading || doc.active} className="crud-btn-delete" style={{ opacity: doc.active ? 0.3 : 1 }}>Delete</button>
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

export default ManageResumes;