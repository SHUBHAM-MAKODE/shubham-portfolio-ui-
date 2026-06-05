import React from 'react';
import './TechWork.css';

const TechWork = ({ skills = [] }) => {
  // Hardcoded backup array if no data is passed down by the parent container
  const fallbackSkills = [
    { name: "Java", rating: 5, iconUrl: "https://via.placeholder.com/60" },
    { name: "Spring Boot", rating: 4, iconUrl: "https://via.placeholder.com/60" },
    { name: "React.js", rating: 4, iconUrl: "https://via.placeholder.com/60" },
    { name: "MySQL", rating: 4, iconUrl: "https://via.placeholder.com/60" },
    { name: "Flutter", rating: 5, iconUrl: "https://via.placeholder.com/60" },
    { name: "JavaScript", rating: 4, iconUrl: "https://via.placeholder.com/60" }
  ];

  // Select between parent passed API array or local baselines
  const displaySkills = skills && skills.length > 0 ? skills : fallbackSkills;

  // Helper function to convert dynamic numbers/ratings safely into star bars
  const renderStars = (rating) => {
    // Normalizes ratings if backend passes them as scale values (e.g., 80% or out of 5)
    const normalizedRating = rating > 5 ? Math.round(rating / 20) : Math.round(rating || 4);
    const validRating = Math.max(0, Math.min(5, normalizedRating)); // Clamp bounds between 0 and 5
    return "★".repeat(validRating) + "☆".repeat(5 - validRating);
  };

  return (
    <div className="tech-work-display">
      <h1 className="tech-heading">Technologies I've Handled</h1>
      
      <div className="tech-grid">
        {displaySkills.map((tech, index) => (
          <div className="tech-card" key={tech.id || index}>
            <img 
              src={tech.iconUrl || tech.icon} 
              alt={tech.name || tech.title} 
              className="tech-icon" 
              onError={(e) => { e.target.src = "https://png.pngtree.com/png-clipart/20210314/original/pngtree-not-loaded-during-loading-png-image_6083139.jpg"; }}
            />
            
            {/* Hover overlay remains fully responsive and animated */}
            <div className="tech-hover-overlay">
              <span className="tech-name">{tech.name || tech.title}</span>
              <span className="tech-stars">{renderStars(tech.rating || tech.proficiency)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechWork;