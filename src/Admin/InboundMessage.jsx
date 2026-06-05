import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './InboundMessages.css'; // 1. Hooking up our explicit plain CSS sheet

const InboundMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const response = await API.get('/messages/all');
      const dataPayload = response.data?.data || [];
      const sorted = dataPayload.sort((a, b) => b.id - a.id);
      setMessages(sorted);

      if (sorted.length > 0 && !selectedMessage) {
        setSelectedMessage(sorted[0]);
      }
    } catch (err) {
      console.error("Failed to sync inbound message packets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);

    if (!msg.isRead) {
      try {
        await API.put(`/messages/read/${msg.id}`);
        setMessages(prev =>
          prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m)
        );
      } catch (err) {
        console.error("Failed to flag message status as read:", err);
      }
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this message record?")) return;

    setActionLoading(true);
    try {
      await API.delete(`/messages/delete/${id}`);
      const updatedMessages = messages.filter(m => m.id !== id);
      setMessages(updatedMessages);
      setSelectedMessage(updatedMessages.length > 0 ? updatedMessages[0] : null);
    } catch (err) {
      alert("Failed to delete the message packet. Please try again.");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="inbox-loading-wrapper">
        <div className="loading-pulse-text">Syncing Communication Nodes...</div>
      </div>
    );
  }

  return (
    <div className="inbox-panel-container dashboard-view-fade">

      {/* Dynamic Header Block */}
      <div className="inbox-header-block">
        <h3>Inbound Messages Inbox</h3>
        <p>Review full details text payloads, email targets, and subject data packets from clients.</p>
      </div>

      {messages.length === 0 ? (
        <div className="empty-inbox-fallback">
          <span className="fallback-icon">📥</span>
          <p>Your inbound message stream is completely empty.</p>
        </div>
      ) : (
        /* TWO-COLUMN INBOX FLEX/GRID SPLIT */
        <div className="inbox-split-workspace">

          {/* LEFT COLUMN: MASTER STREAM SIDEBAR */}
          <div className="inbox-sidebar-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`inbox-message-item ${selectedMessage?.id === msg.id ? 'active-item' : ''}`}
              >
                {/* Unread Alert Indicator Core Badge */}
                {!msg.isRead && <span className="unread-pulse-dot" />}

                <div className="message-item-summary">
                  <h4 className={!msg.isRead ? 'unread-font' : 'read-font'}>
                    {msg.name}
                  </h4>
                  <p className="item-subject-truncate">{msg.subject}</p>
                  <span className="item-timestamp">
                    {msg.date || new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: READING PANE DETAIL VIEW */}
          <div className="inbox-reading-pane">
            {selectedMessage ? (
              <div className="reading-pane-wrapper">

                <div className="reading-pane-content">
                  {/* Message Detail Metadata Header */}
                  <div className="reading-header-meta">
                    <div className="sender-meta-details">
                      <h4>{selectedMessage.name}</h4>
                      <p className="sender-email-mono">{selectedMessage.email}</p>
                    </div>
                    <span className="entity-id-badge">
                      ID: #{selectedMessage.id}
                    </span>
                  </div>

                  {/* Subject and Payload Text Area */}
                  <div className="reading-body-payload">
                    <div className="payload-group">
                      <span className="payload-label">Subject Topic</span>
                      <h5 className="payload-subject-text">{selectedMessage.subject}</h5>
                    </div>

                    <div className="payload-group">
                      <span className="payload-label">Message Payload</span>
                      <div className="payload-text-content-box">
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Secure Action Trigger Bar */}
                <div className="reading-pane-actions-footer">
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    disabled={actionLoading}
                    className="purge-packet-action-btn"
                  >
                    🗑️ {actionLoading ? "Purging Record..." : "Delete Message Packet"}
                  </button>
                </div>

              </div>
            ) : (
              <div className="empty-pane-placeholder">
                <span>Select a message from the sidebar stream to examine payload details.</span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default InboundMessages;