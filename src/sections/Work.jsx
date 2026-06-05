import React, { useState } from 'react';
import './Work.css';


const Work = ({ projects = [] }) => {
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Fallback production data keeping your exact master system descriptions intact if array is empty
  const fallbackProjects = [
    {
      id: 1,
      title: "FoodExpress",
      description: "FoodExpress is a robust multi-role full-stack web application featuring dedicated flows for Customers, Restaurant Owners, and Delivery Personnel. Built with React.js on the frontend and Spring Boot on the backend, it utilizes PostgreSQL for reliable relational data management. Features include real-time order tracking, secure payment gateways, dynamic menu management, and state-driven delivery statuses.",
      imageUrl: "https://via.placeholder.com/400x300", 
      techStack: ["React.js", "Spring Boot", "PostgreSQL", "Tailwind CSS"]
    },
    {
      id: 2,
      title: "Nexus Library Management",
      description: "Nexus is a high-performance database management platform engineered using Java EE, JDBC, and MySQL. It optimizes indexing, search query execution, and core book transactions (issue/return tracking). Designed with an emphasis on strict data integrity, normalized schemas, and secure administrator authorization access controls.",
      imageUrl: "https://via.placeholder.com/400x300",
      techStack: ["Java EE", "JDBC", "MySQL", "CSS Component Architecture"]
    },
    {
      id: 3,
      title: "Story Application",
      description: "A smooth, highly intuitive mobile platform engineered using Flutter and Dart. Designed with a gorgeous modern user interface featuring glassmorphic effects and dark mode consistency. Implements streamlined local and cloud state synchronization to load, read, and bookmark interactive articles or stories seamlessly on both iOS and Android.",
      imageUrl: "https://via.placeholder.com/400x300",
      techStack: ["Flutter", "Dart", "State Management", "UI/UX Design"]
    }
  ];

  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects;

  return (
    <div className="work-section">
      <h1 className="work-heading">Featured Projects</h1>

      {/* Grid Container for Projects */}
      <div className="work-grid">
        {displayProjects.map((project, index) => (
          <div className="work-card" key={project.id || index} onClick={() => setActiveModalProject(project)}>
            <img src={project.imageUrl || project.image} alt={project.title} className="project-img" />
            
            {/* Hover Overlay Panel */}
            <div className="project-hover-overlay">
              <h3 className="overlay-title">{project.title}</h3>
              <p className="overlay-desc" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {project.description}
              </p>
              <button 
                className="read-more-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents double-triggering modal if card wrapper layout has onClick
                  setActiveModalProject(project);
                }}
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Description Modal Overlay */}
      {activeModalProject && (
        <div className="modal-overlay" onClick={() => setActiveModalProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setActiveModalProject(null)}>✕</button>
            
            <div className="modal-img-wrapper">
              <img src={activeModalProject.imageUrl || activeModalProject.image} alt={activeModalProject.title} className="modal-img" />
            </div>
            
            <div className="modal-body">
              <h2>{activeModalProject.title}</h2>
              {(activeModalProject.techStack || activeModalProject.tech) && (activeModalProject.techStack || activeModalProject.tech).length > 0 && (
                <div className="modal-tech-stack">
                  {(activeModalProject.techStack || activeModalProject.tech).map((t, idx) => (
                    <span key={idx} className="modal-tag">{t.trim()}</span>
                  ))}
                </div>
              )}
              <p className="modal-full-desc">{activeModalProject.description || activeModalProject.fullDesc}</p>
              {activeModalProject.liveUrl && (
                <a 
                  href={activeModalProject.liveUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="resume-btn preview-btn" 
                  style={{ display: 'inline-block', marginTop: '15px', textAlign: 'center', textDecoration: 'none' }}
                >
                  Visit Live Site 🌐
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;