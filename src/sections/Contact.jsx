import React, { useState } from 'react';
import publicAPI from '../services/publicApi';
import './Contact.css';

const Contact = () => {
    // State configuration to track contact form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');

        try {
            // Live connection to your Spring Boot database endpoint
            await publicAPI.post('/messages/send', formData);

            setFormStatus('success');
            // Reset form fields upon successful database persistence transaction
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error("Failed to route public communication message payload:", err);
            setFormStatus('error');
        }
    };

    return (
        <div className="contact-section">

            {/* Foreground Container Platform */}
            <div className="contact-container">

                {/* Left Column: Direct Info & Social Channels */}
                <div className="contact-info-panel">
                    <h1 className="contact-heading">Let's Connect</h1>
                    <p className="contact-subheading">
                        I'm always open to discussing new full-stack engineering opportunities, project collaborations, or technical challenges.
                    </p>

                    <div className="info-details-list">
                        <div className="info-item">
                            <span className="info-icon">📧</span>
                            <div className="info-text">
                                <h4>Email Me</h4>
                                <a href="mailto:shubhammakode93@gmail.com">shubhammakode93@gmail.com</a>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="info-icon">📍</span>
                            <div className="info-text">
                                <h4>Location</h4>
                                <p>Bengaluru, India</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Profiles Grid */}
                    <div className="social-links-container">
                        <h4>Find Me On</h4>
                        <div className="social-row">
                            <a href="https://www.linkedin.com/in/shubham-makode/" target="_blank" rel="noreferrer" className="social-badge linkedin">LinkedIn</a>
                            <a href="https://github.com/SHUBHAM-MAKODE" target="_blank" rel="noreferrer" className="social-badge github">GitHub</a>
                            <a href="https://leetcode.com/u/shubham_makode/" target="_blank" rel="noreferrer" className="social-badge leetcode">LeetCode</a>
                        </div>
                    </div>
                </div>

                {/* Right Column: Interactive Form Platform */}
                <div className="contact-form-panel">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group-row">
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input
                                    type="text" id="name" name="name" required
                                    value={formData.name} onChange={handleChange}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Your Email</label>
                                {/* FIXED: Changed type="type" to type="email" */}
                                <input
                                    type="email" id="email" name="email" required
                                    value={formData.email} onChange={handleChange}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text" id="subject" name="subject" required
                                value={formData.subject} onChange={handleChange}
                                placeholder="Collaboration Opportunity"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message" name="message" rows="6" required
                                value={formData.message} onChange={handleChange}
                                placeholder="Type your message here..."
                            />
                        </div>

                        <button type="submit" className="form-submit-btn" disabled={formStatus === 'sending'}>
                            {formStatus === 'sending' ? 'Sending...' : 'Send Message 🚀'}
                        </button>

                        {formStatus === 'success' && (
                            <p className="form-status-msg success">✓ Message sent successfully! I'll get back to you shortly.</p>
                        )}

                        {formStatus === 'error' && (
                            <p className="form-status-msg error">✕ Connection error. Please try again or reach out directly via email.</p>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Contact;