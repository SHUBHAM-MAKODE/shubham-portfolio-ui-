import React, { useState, useEffect, useRef } from 'react';
import Typed from 'typed.js';
import publicAPI from '../services/publicApi'; 

// Ambient Layout Component Imports
import PrismBackground from '../Background/PrismBackground.';


import './DashBoard.css';


// =========================================================================
// SECTION 1: INTERNAL UI SUB-COMPONENTS (Consuming Extracted Context Data)
// =========================================================================

const WhatIdoCard = ({ imageUrl, title, description }) => (
    <div className="whatIdo-card">
        <img src={imageUrl} alt={title} className="whatIdo-icon" />
        <div className="whatIdo-card-text">
            <h3 className="whatIdo-card-title">{title}</h3>
            <p className="whatIdo-card-description">{description}</p>
        </div>
    </div>
);

const Exp = ({ data }) => {
    if (!data || data.length === 0) return <div className="exp-loading-state">No Experience Nodes Registered...</div>;

    return (
        <div className='exp-display'>
            <h1 className="exp-heading">Work Experience</h1>
            <div className='exp-card-container'>
                {data.map((exp, index) => (
                    <div className="exp-card" key={exp.id || index}>
                        <div className="exp-card-header">
                            {exp.companyLogoUrl || exp.logo ? (
                                <img src={exp.companyLogoUrl || exp.logo} alt={exp.company} className="company-logo" />
                            ) : (
                                <div className="company-logo-fallback" style={{
                                    width: '45px', height: '45px', borderRadius: '8px', backgroundColor: '#0f172a',
                                    border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '13px', fontWeight: '700', color: '#3b82f6', flexShrink: 0
                                }}>
                                    {exp.company ? exp.company.substring(0, 2).toUpperCase() : '💼'}
                                </div>
                            )}
                            <div className="header-info">
                                <h2>{exp.role}</h2>
                                <h3>{exp.company} • <span className="location-type">{exp.location}</span></h3>
                            </div>
                            <span className="exp-duration">{exp.duration}</span>
                        </div>
                        {exp.descriptionPoints && exp.descriptionPoints.length > 0 && (
                            <ul className="exp-points">
                                {exp.descriptionPoints.map((point, i) => <li key={i}>{point.trim()}</li>)}
                            </ul>
                        )}
                        {exp.skills && exp.skills.length > 0 && (
                            <div className="exp-tech-tags">
                                {exp.skills.map((skill, i) => <span className="tech-tag" key={i}>{skill.trim()}</span>)}
                            </div>
                        )}
                    </div>
                ))}
            </div>      
        </div>
    );
};

const Education = ({ data }) => {
    const [expandedIndex, setExpandedIndex] = useState(0);

    if (!data || data.length === 0) return <div className="edu-loading-state">No Academic Records Registered...</div>;

    return (
        <div className='edu-display'>
            <h1 className="edu-heading">Education History</h1>
            <div className='edu-accordion-container'>
                {data.map((edu, index) => {
                    const isExpanded = expandedIndex === index;
                    return (
                        <div className={`accordion-item ${isExpanded ? 'active' : ''}`} key={edu.id || index}>
                            <div className="accordion-header" onClick={() => setExpandedIndex(isExpanded ? null : index)}>
                                <div className="edu-logo-fallback">🎓</div>
                                <div className="header-info">
                                    <h2>{edu.degree}</h2>
                                    <h3>{edu.institution} • <span className="location-type">{edu.location}</span></h3>
                                </div>
                                <div className="header-right">
                                    <span className="edu-duration">{edu.duration}</span>
                                    <span className="accordion-icon">{isExpanded ? '▲' : '▼'}</span>
                                </div>
                            </div>
                            <div className={`accordion-content ${isExpanded ? 'show' : ''}`}>
                                <div className="edu-performance">
                                    <strong>Status/Grade:</strong> <span className="grade-badge">{edu.grade}</span>
                                </div>
                                {edu.details && edu.details.length > 0 && (
                                    <ul className="edu-points">
                                        {edu.details.map((point, i) => <li key={i}>{point.trim()}</li>)}
                                    </ul>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>      
        </div>
    );
};

const TechWork = ({ data }) => {
    if (!data || data.length === 0) return <div className="tech-loading-state">No Skills Profile Compiled...</div>;

    const renderStars = (rating) => {
        const normalizedRating = rating > 5 ? Math.round(rating / 20) : Math.round(rating || 4);
        const validRating = Math.max(0, Math.min(5, normalizedRating));
        return "★".repeat(validRating) + "☆".repeat(5 - validRating);
    };

    return (
        <div className="tech-work-display">
            <h1 className="tech-heading">Technologies I've Handled</h1>
            <div className="tech-grid">
                {data.map((tech, index) => (
                    <div className="tech-card" key={tech.id || index}>
                        <img 
                            src={tech.iconUrl || tech.icon} 
                            alt={tech.name} 
                            className="tech-icon" 
                            onError={(e) => { e.target.src = "https://via.placeholder.com/60?text=Code"; }}
                        />
                        <div className="tech-hover-overlay">
                            <span className="tech-name">{tech.name}</span>
                            <span className="tech-stars">{renderStars(tech.rating)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SpecializationTech = () => (
    <div className="tech-work-display">
        <h1 className="tech-heading">Specialization Area</h1>
        <p style={{color: '#64748b', textAlign:'center', marginTop: '20px'}}>Enterprise Application Architectures & Cross-Platform Systems Development.</p>
    </div>
);

const GrabMyResume = ({ data }) => {
    const activeResume = data?.find(r => r.active) || data?.[0];
    const resumeUrl = activeResume?.downloadUrl || "/Shubham_Makode_Resume.pdf";

    return (
        <div className="resume-section">
            <div className="resume-container">
                <div className="resume-info">
                    <h1 className="resume-heading">Looking for a Full Stack Developer?</h1>
                    <p className="resume-subheading">
                        I build scalable web architectures with Spring Boot & React, and smooth cross-platform mobile apps with Flutter. Download my full resume to see my detailed project history, technical expertise, and academic background.
                    </p>
                    <div className="resume-actions">
                        <a href={resumeUrl} target="_blank" rel="noreferrer" download="Shubham_Makode_Resume.pdf" className="resume-btn download-btn">
                            <span className="btn-icon">📥</span> Download PDF
                        </a>
                        <a href={`${resumeUrl}#view=FitH`} target="_blank" rel="noreferrer" className="resume-btn preview-btn">
                            <span className="btn-icon">👁️</span> Preview Resume
                        </a>
                    </div>
                </div>
                <div className="resume-highlights">
                    <h3>Quick Highlights</h3>
                    <ul>
                        <li><strong>Core Languages:</strong> Java, C++, JavaScript, SQL, Dart</li>
                        <li><strong>Frameworks:</strong> Spring Boot, React.js, Flutter, Java EE</li>
                        <li><strong>Databases & DevOps:</strong> MySQL, PostgreSQL, Docker</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// SECTION 2: CORE PORTFOLIO ENGINE (Dashboard Layout)
// =========================================================================
const DashBoard = () => {
    const el = useRef(null);
    const containerRef = useRef(null);
    
    // Core Application Global State
    const [portfolioData, setPortfolioData] = useState(null);
    const [globalLoading, setGlobalLoading] = useState(true);

    // Tab Tracking State Variables
    const [activeTab, setActiveTab] = useState('experience');
    const [activeModalProject, setActiveModalProject] = useState(null);

    // Form Submissions Local Tracking
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formStatus, setFormStatus] = useState('');

    // --- EFFECT: Single Unified API Handshake (Runs once on first component load) ---
    useEffect(() => {
        const fetchAllPortfolioData = async () => {
            try {
                // Hits your secure centralized dashboard bootstrap platform endpoint
                const response = await publicAPI.get('/portfolio/all'); 
                if (response.data && response.data.data) {
                    setPortfolioData(response.data.data);
                }
            } catch (err) {
                console.error("Critical core runtime data mapping error:", err);
            } finally {
                setGlobalLoading(false);
            }
        };
        fetchAllPortfolioData();
    }, []);

    // --- EFFECT: Typist Dynamic Roles Mapping ---
    useEffect(() => {
        if (!el.current || !portfolioData?.roles || portfolioData.roles.length === 0) return;
        
        const typed = new Typed(el.current, {
            strings: portfolioData.roles,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
        });
        return () => typed.destroy();
    }, [portfolioData]);

    // --- EFFECT: What I Do Non-Passive Scroll Hook Interceptor ---
    useEffect(() => {
        if (globalLoading || !portfolioData?.services) return;
        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        const handleNativeWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                scrollContainer.scrollLeft += e.deltaY;
            }
        };
        scrollContainer.addEventListener('wheel', handleNativeWheel, { passive: false });
        return () => scrollContainer.removeEventListener('wheel', handleNativeWheel);
    }, [globalLoading, portfolioData]);

    // --- HANDLERS: Form Processing ---
    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');
        try {
            await publicAPI.post('/messages/send', formData);
            setFormStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error("Failed to map connection payload transaction:", err);
            setFormStatus('error');
        }
    };

    // Central loading baseline fallback screen
    if (globalLoading) {
        return (
            <div style={{
                backgroundColor: '#0b0c10', color: '#6388f6', height: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'monospace', fontSize: '18px', letterSpacing: '2px'
            }}>
                COMPILING PORTFOLIO PIPELINES...
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <div className="background-layer">
                <PrismBackground />
            </div>

            <div className="content-layer">
                
                {/* Global Navbar */}
                <div className="nav-continer">
                    <div className="logo">Shubham Makode</div>
                    <div className="nav-link">
                        <a href="#hero">Home</a>
                        <a href="#about">About</a>
                        <a href="#passion">Passion</a>
                        <a href="#experience">Education & Experience</a>
                        <a href="#work">Work</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>

                {/* HERO BLOCK */}
                <div className="hero-section-bg" id="hero">
                    <div className="hero-text-content">
                        <h1>Hi,</h1>
                        <h2>It's me, <span>Shubham Makode</span></h2>
                        <p>Designation: <span ref={el} className="rotating-words"></span></p>
                        <span className="arrow-down">v</span>
                    </div>
                    <div className="hero-img">
                        <img src={"https://res.cloudinary.com/dl5e6thva/image/upload/v1779995565/portfolio/projects/nfyztcyf711mxtx87slt.png"} alt="Shubham Makode" />
                    </div>
                </div>

                {/* ABOUT BLOCK */}
                <div id="about" className='block-container'>
                    <div className="about-section-bg">
                        <div className="about-heading">About Me</div>
                        <div className="about-content">
                            <div className="about-img">
                                <img src={"https://res.cloudinary.com/dl5e6thva/image/upload/v1780027512/portfolio/projects/opasorfnjsdk3u91n8cf.png"} alt="Shubham Makode" />
                            </div>
                            <div className="about-text">
                                <h1>A LITTLE BIT ABOUT ME</h1>
                                <p>
                                    Hi! My name is Shubham Makode, and I am a Full-Stack Web Developer
                                    and Cross-Platform Mobile App Developer passionate about creating
                                    responsive and user-friendly applications. I build modern web and
                                    mobile solutions using React.js, Spring Boot, Java, and Flutter,
                                    focusing on clean design, strong functionality, and seamless user experiences.
                                </p>
                                <h2>
                                    When I'm not coding, I enjoy watching anime, exploring new
                                    technologies, and spending quality time with friends.
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PASSION (WHAT I DO) BLOCK */}
                <div id="passion" className='block-container'>
                    <div className='whatido-section'>
                        <div className="whatido-shader-bg">
                            <Prism animationType="rotate" timeScale={0.5} height={3.5} baseWidth={5.5} scale={3.6} hueShift={0} colorFrequency={1} noise={0} glow={1} />
                        </div>
                        <div className='whatido-section-bg'>
                            <div className="whatido-heading">What I Do</div>
                            <div className="whatIdo-card-container" ref={containerRef}>
                                {portfolioData?.services?.map((item, index) => (
                                    <WhatIdoCard key={item.id || index} imageUrl={item.imageUrl} title={item.title} description={item.description} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TIMELINE SEGMENT TRACK (EXPERIENCE / EDUCATION / SKILLS) */}
                <div id="experience" className='block-container'>
                    <div className='experience-section'>
                        <div className="experience-shader-bg">
                            <Radar speed={1} scale={0.5} ringCount={10} spokeCount={10} ringThickness={0.05} spokeThickness={0.01} sweepSpeed={1} sweepWidth={2} sweepLobes={1} color="#6388f6" backgroundColor="#0b0c10" falloff={2} brightness={1} enableMouseInteraction mouseInfluence={0.1} />
                        </div>
                        <div className='experience-section-bg'>
                            <div className="experience-btn-container">
                                <button className={activeTab === 'experience' ? 'active-btn' : ''} onClick={() => setActiveTab('experience')}>Experience</button>
                                <button className={activeTab === 'education' ? 'active-btn' : ''} onClick={() => setActiveTab('education')}>Education</button>
                                <button className={activeTab === 'tech' ? 'active-btn' : ''} onClick={() => setActiveTab('tech')}>Tech I Worked With</button>
                                <button className={activeTab === 'specialization' ? 'active-btn' : ''} onClick={() => setActiveTab('specialization')}>Specialization</button>
                                <button className={activeTab === 'Grab-My-Resume' ? 'active-btn' : ''} onClick={() => setActiveTab('Grab-My-Resume')}>Grab My Resume</button>
                            </div>
                            <div className='exp-display-block'>
                                {activeTab === 'experience' && <Exp data={portfolioData?.experiences} />}
                                {activeTab === 'education' && <Education data={portfolioData?.education} />}
                                {activeTab === 'tech' && <TechWork data={portfolioData?.skills} />}
                                {activeTab === 'specialization' && <SpecializationTech />}
                                {activeTab === 'Grab-My-Resume' && <GrabMyResume data={portfolioData?.resumes} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FEATURED WORK SHOWCASE GRID OVERLAY */}
                <div id="work" className='block-container'>
                    <div className="work-shader-bg">
                        <Prism animationType="rotate" timeScale={0.5} height={3.5} baseWidth={5.5} scale={3.6} hueShift={0} colorFrequency={1} noise={0} glow={1} />
                    </div>
                    <div className="work-section">
                        <h1 className="work-heading">Featured Projects</h1>
                        <div className="work-grid">
                            {portfolioData?.projects?.map((project, index) => (
                                <div className="work-card" key={project.id || index}>
                                    <img src={project.imageUrl} alt={project.title} className="project-img" />
                                    <div className="project-hover-overlay">
                                        <h3 className="overlay-title">{project.title}</h3>
                                        <p className="overlay-desc" style={{
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                        }}>{project.description}</p>
                                        <button className="read-more-btn" onClick={() => setActiveModalProject(project)}>Read More →</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {activeModalProject && (
                            <div className="modal-overlay" onClick={() => setActiveModalProject(null)}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <button className="close-modal-btn" onClick={() => setActiveModalProject(null)}>✕</button>
                                    <div className="modal-img-wrapper">
                                        <img src={activeModalProject.imageUrl} alt={activeModalProject.title} className="modal-img" />
                                    </div>
                                    <div className="modal-body">
                                        <h2>{activeModalProject.title}</h2>
                                        {activeModalProject.techStack && activeModalProject.techStack.length > 0 && (
                                            <div className="modal-tech-stack">
                                                {activeModalProject.techStack.map((t, idx) => <span key={idx} className="modal-tag">{t.trim()}</span>)}
                                            </div>
                                        )}
                                        <p className="modal-full-desc">{activeModalProject.description}</p>
                                        {activeModalProject.liveUrl && (
                                            <a href={activeModalProject.liveUrl} target="_blank" rel="noreferrer" className="resume-btn preview-btn" style={{display:'inline-block', marginTop:'15px', textAlign:'center'}}>Visit Live Project Site</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CONTACT HOST HUB */}
                <div id="contact" className='block-container'>
                    <div className="contact-section">
                        <div className="contact-shader-bg">
                            <Prism animationType="rotate" timeScale={0.5} height={3.5} baseWidth={5.5} scale={3.6} hueShift={0} colorFrequency={1} noise={0} glow={1} />
                        </div>
                        <div className="contact-container">
                            <div className="contact-info-panel">
                                <h1 className="contact-heading">Let's Connect</h1>
                                <p className="contact-subheading">I'm always open to discussing new full-stack engineering opportunities, project collaborations, or technical challenges.</p>
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
                                <div className="social-links-container">
                                    <h4>Find Me On</h4>
                                    <div className="social-row">
                                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-badge linkedin">LinkedIn</a>
                                        <a href="https://github.com" target="_blank" rel="noreferrer" className="social-badge github">GitHub</a>
                                        <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="social-badge leetcode">LeetCode</a>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-form-panel">
                                <form onSubmit={handleContactSubmit} className="contact-form">
                                    <div className="form-group-row">
                                        <div className="form-group">
                                            <label htmlFor="name">Your Name</label>
                                            <input type="text" id="name" name="name" required value={formData.name} onChange={handleContactChange} placeholder="John Doe" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Your Email</label>
                                            <input type="email" id="email" name="email" required value={formData.email} onChange={handleContactChange} placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subject">Subject</label>
                                        <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleContactChange} placeholder="Collaboration Opportunity" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message">Message</label>
                                        <textarea id="message" name="message" rows="6" required value={formData.message} onChange={handleContactChange} placeholder="Type your message here..." />
                                    </div>
                                    <button type="submit" className="form-submit-btn" disabled={formStatus === 'sending'}>
                                        {formStatus === 'sending' ? 'Sending...' : 'Send Message 🚀'}
                                    </button>
                                    {formStatus === 'success' && <p className="form-status-msg success">✓ Message sent successfully! I'll get back to you shortly.</p>}
                                    {formStatus === 'error' && <p className="form-status-msg error">✕ Connection error. Please try again or reach out directly via email.</p>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashBoard;