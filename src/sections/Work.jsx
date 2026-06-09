import React, { useState } from 'react';
import './Work.css';


const Work = ({ projects = [] }) => {
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Fallback production data keeping your exact master system descriptions intact if array is empty
  const fallbackProjects = [
      {
            "id": 2,
            "title": "Storytelling Application",
            "description": "Developed a cross-platform mobile application using Flutter and Dart designed to enhance reading comprehension across Beginner, Intermediate, and Advanced proficiency levels.\r\n\r\nImplemented a dynamic quiz engine that generates randomized assessment questions post-story to reinforce user learning and track progress.",
            "techStack": [
                "Flutter",
                "Dart"
            ],
            "liveUrl": "",
            "githubUrl": null,
            "imageUrl": "https://res.cloudinary.com/dl5e6thva/image/upload/v1780916517/portfolio/projects/file_bahpnj.png",
            "imagePublicId": "portfolio/projects/file_bahpnj"
        },
        {
            "id": 3,
            "title": "Nexus Library Management System (Backend)",
            "description": "Designed and implemented a robust backend architecture using Core Java to automate book tracking, member enrollment, and borrowing workflows.\r\n\r\nEngineered secure, optimized CRUD operations and transactional logic for seamless book issue/return functionality using JDBC API.\r\n\r\nDeveloped a structured relational database schema in MySQL, utilizing raw SQL queries and connection pools to ensure data integrity and streamlined record management.",
            "techStack": [
                "Java",
                "JDBC",
                "MySQL",
                "Relational Database Design"
            ],
            "liveUrl": "",
            "githubUrl": null,
            "imageUrl": "https://res.cloudinary.com/dl5e6thva/image/upload/v1780916596/portfolio/projects/file_mcojr8.jpg",
            "imagePublicId": "portfolio/projects/file_mcojr8"
        },
        {
            "id": 4,
            "title": "E-Commerce Platform Frontend",
            "description": "Built a modern, responsive e-commerce web application using React.js and JavaScript (ES6+), focusing on high performance and intuitive navigation.\r\n\r\nDeveloped modular components for product listings, category-based filtering, real-time search, and interactive shopping cart management.\r\n\r\nApplied cutting-edge HTML5 and CSS3 design principles to optimize rendering speeds and ensure seamless layout consistency across mobile, tablet, and desktop viewports.",
            "techStack": [
                "React.js",
                "JavaScript (ES6+)",
                "HTML5",
                "CSS3",
                "Responsive Design"
            ],
            "liveUrl": "",
            "githubUrl": null,
            "imageUrl": "https://res.cloudinary.com/dl5e6thva/image/upload/v1780916645/portfolio/projects/file_xjuvoa.png",
            "imagePublicId": "portfolio/projects/file_xjuvoa"
        },
        {
            "id": 6,
            "title": "Professional Portfolio Website",
            "description": "Designed and deployed a personal portfolio website using semantic HTML5, modern CSS3, and vanilla JavaScript to showcase technical competencies, full-stack projects, and professional milestones.\r\n\r\nImplemented a clean architecture featuring smooth scrolling navigation, interactive UI triggers, and custom aesthetic styling.\r\n\r\nOptimized media assets and layouts for cross-browser compatibility and highly responsive performance on all mobile and desktop screen sizes.",
            "techStack": [
                "HTML5",
                "CSS3",
                "JavaScript",
                "UI/UX Design"
            ],
            "liveUrl": "",
            "githubUrl": null,
            "imageUrl": "https://res.cloudinary.com/dl5e6thva/image/upload/v1780916809/portfolio/projects/file_ouc1zs.png",
            "imagePublicId": "portfolio/projects/file_ouc1zs"
        },
        {
            "id": 7,
            "title": "Course Management System Frontend",
            "description": "Developed an intuitive learning dashboard using React.js, enabling users to browse educational catalogs, view detailed course syllabi, and track enrollment milestones.\r\n\r\nUtilized advanced React state management and conditional rendering to deliver dynamic, asynchronous data updates without forcing page reloads.\r\n\r\nEmphasized clean component-driven development and code reusability in JavaScript to accelerate development and simplify future feature scaling.",
            "techStack": [
                "React.js",
                "JavaScript",
                "State Management",
                "Component-Driven Development"
            ],
            "liveUrl": "",
            "githubUrl": null,
            "imageUrl": "https://res.cloudinary.com/dl5e6thva/image/upload/v1780916850/portfolio/projects/file_hq54qq.jpg",
            "imagePublicId": "portfolio/projects/file_hq54qq"
        },
        {
            "id": 8,
            "title": "Employee Management System Backend",
            "description": "Engineered a scalable enterprise backend application using Java and Spring Boot, providing comprehensive RESTful APIs for organizational record management.\r\n\r\nImplemented strict data validation, global exception handling, and structured response bodies to guarantee API reliability and secure request filtering.\r\n\r\nIntegrated the application layer with a MySQL database for efficient persistence layer management, maintaining optimal system performance and clean maintainability.",
            "techStack": [
                "Java",
                "Spring Boot",
                "MySQL",
                "RESTful APIs",
                "Exception Handling"
            ],
            "liveUrl": "",
            "githubUrl": null,
            "imageUrl": "https://res.cloudinary.com/dl5e6thva/image/upload/v1780916917/portfolio/projects/file_ip5eyu.jpg",
            "imagePublicId": "portfolio/projects/file_ip5eyu"
        },
        {
            "id": 1,
            "title": "FoodExpress (Food Delivery Application)",
            "description": "Architected and developed a multi-role, full-stack food delivery platform featuring secure user authentication, interactive restaurant browsing, and dynamic menu management.\\r\\n\\r\\nImplemented end-to-end cart state management and a robust order placement engine.\\r\\n\\r\\nDesigned and integrated high-performance RESTful APIs to handle data flow between the React frontend and Spring Boot backend, ensuring a seamless user experience.",
            "techStack": [
                "Java",
                "Spring Boot",
                "React",
                "PostgreSQL",
                "RESTful APIs",
                "JWT Authentication"
            ],
            "liveUrl": "\"\"",
            "githubUrl": "github.com123",
            "imageUrl": "https://res.cloudinary.com/dl5e6thva/image/upload/v1780916434/portfolio/projects/file_hs6z8c.png",
            "imagePublicId": "portfolio/projects/file_hs6z8c"
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