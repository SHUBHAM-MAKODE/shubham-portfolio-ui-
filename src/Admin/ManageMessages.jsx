import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './ManageMessages.css';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); 
  
  // Mobile helper state to track if a message pane overlay should display open
  const [isPaneOpen, setIsPaneOpen] = useState(false);

  const fetchInbox = async () => {
    try {
      const response = await API.get('/messages/all');
      const data = response.data?.data || [];
      setMessages(data);
      
      if (selectedMessage) {
        const updated = data.find(m => m.id === selectedMessage.id);
        setSelectedMessage(updated || null);
      }
    } catch (err) {
      console.error("Failed to parse administrative inbox stream:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    setIsPaneOpen(true); // Extends full screen reading visibility over table rows on phones
    
    if (!msg.isRead) {
      try {
        await API.patch(`/messages/toggle-read/${msg.id}`);
        fetchInbox();
      } catch (err) {
        console.error("Failed to execute read flag state mutation:", err);
      }
    }
  };

  const handleToggleReadStatus = async (id, e) => {
    e.stopPropagation(); 
    try {
      await API.patch(`/messages/toggle-read/${id}`);
      fetchInbox();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Permanently purge this visitor inquiry record?")) return;
    try {
      await API.delete(`/messages/delete/${id}`);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
        setIsPaneOpen(false);
      }
      fetchInbox();
    } catch (err) {
      console.error(err);
      alert("Failed to drop message index registry tracking node.");
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.isRead;
    if (filter === 'read') return msg.isRead;
    return true;
  });

  const formatTimestamp = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (loading) {
    return <div className="messages-mgmt-loading">Reading Incoming Communications Encryption Matrix...</div>;
  }

  return (
    <div className="messages-mgmt-container dashboard-view-fade">
      <div style={{ marginBottom: '24px' }}>
        <h2>Inquiries Inbox Logs</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
          Review communication forms dispatched by potential employers, tech recruiters, and corporate network visitors.
        </p>
      </div>

      {/* FILTER CONTROL SEGMENTS BAR */}
      <div className="inbox-filter-bar">
        <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All Mail <span>({messages.length})</span>
        </button>
        <button className={`filter-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
          Unread <span>({messages.filter(m => !m.isRead).length})</span>
        </button>
        <button className={`filter-tab ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
          Archived <span>({messages.filter(m => m.isRead).length})</span>
        </button>
      </div>

      {/* DYNAMIC VIEW STATE HOOK FOR MASTER-DETAIL BLOCK LAYOUTS */}
      <div className={`inbox-split-workspace ${isPaneOpen ? 'pane-active-view' : 'list-active-view'}`}>
        
        {/* LEFT COLUMN: LIST STREAM */}
        <div className="inbox-list-pane">
          {filteredMessages.length === 0 ? (
            <div className="empty-inbox-fallback">No messages found matching your active filter criteria.</div>
          ) : (
            <div className="inbox-cards-stack">
              {filteredMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`inbox-item-row-card ${!msg.isRead ? 'unread-envelope-style' : ''} ${selectedMessage?.id === msg.id ? 'focused-selection' : ''}`}
                  onClick={() => handleSelectMessage(msg)}
                >
                  <div className="card-top-header">
                    <span className="sender-alias-title">{msg.name}</span>
                    <span className="timestamp-badge-string">{formatTimestamp(msg.receivedAt).split(',')[0]}</span>
                  </div>
                  <h5 className="card-subject-line">{msg.subject}</h5>
                  <p className="card-body-snippet-text">{msg.message}</p>
                  
                  <div className="card-actions-overlay" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => handleToggleReadStatus(msg.id, e)} className="action-icon-trigger" title={msg.isRead ? "Mark Unread" : "Mark Read"}>
                      {msg.isRead ? "📨" : "📖"}
                    </button>
                    <button onClick={(e) => handleDeleteMessage(msg.id, e)} className="action-icon-trigger delete-trigger" title="Purge Record">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        /* RIGHT COLUMN: READING PANEL VIEW */
        <div className="inbox-reading-pane">
          {selectedMessage ? (
            <div className="opened-letter-container">
              
              {/* Back close trigger returned natively for small layouts */}
              <div className="mobile-navigation-pane-header">
                <button onClick={() => setIsPaneOpen(false)} className="pane-close-return-btn">
                  ← Back to Inbox Logs
                </button>
              </div>

              <div className="letter-header">
                <div className="sender-metadata-cluster">
                  <h3>{selectedMessage.subject}</h3>
                  <div className="metadata-row">
                    <span>From: <strong>{selectedMessage.name}</strong> (<a href={`mailto:${selectedMessage.email}`} className="email-mailto-link">{selectedMessage.email}</a>)</span>
                    <span>Received: <em>{formatTimestamp(selectedMessage.receivedAt)}</em></span>
                  </div>
                </div>
                <button onClick={(e) => handleDeleteMessage(selectedMessage.id, e)} className="crud-btn-delete-letter">Delete Message</button>
              </div>
              
              <div className="letter-body-content">
                {selectedMessage.message.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              
              <div className="letter-footer-reply-desk">
                <a href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject)}`} className="reply-dispatch-anchor">
                  ↩ Compose External Email Reply
                </a>
              </div>
            </div>
          ) : (
            <div className="unselected-reading-fallback">
              <div className="fallback-art-icon">📥</div>
              <p>Select an message container packet from your list stack column to load full communication payload content views.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMessages;