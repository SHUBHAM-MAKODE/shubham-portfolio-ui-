import React from 'react';
import './Experience.css';

const Experience = ({ experiences = [] }) => {
  // Hardcoded backup array used if no data prop is supplied by the parent container

  const fallbackExperiences = [
    {
      role: "Full Stack Java Developer Intern",
      company: "JSpiders",
      duration: "Sep 2025 - Present",
      location: "Bengaluru, India",
      companyLogoUrl: null, 
      descriptionPoints: [
        "Architected scalable full-stack multi-role web architectures using Spring Boot, Hibernate JPA, and React.js ecosystems.",
        "Engineered persistent transactional databases using PostgreSQL and MySQL, optimizing indices to cut query fetch latencies.",
        "Built cross-platform responsive mobile applications using Flutter and Dart with robust local state management mechanics."
      ],
      skills: ["Java", "Spring Boot", "React.js", "PostgreSQL", "Flutter", "JavaScript"]
    }
  ];

  // Select between parent passed backend nodes or static baseline backups
  const displayExperiences = experiences && experiences.length > 0 ? experiences : fallbackExperiences;

  return (
    <div className='exp-display'>
      <h1 className="exp-heading">Work Experience</h1>
      
      <div className='exp-card-container'>
        {displayExperiences.map((exp, index) => {
          // 🌟 DYNAMIC BRIDGE: If the live API node has no skills array, bind your core workspace tags directly
          const skillBadges = exp.skills || exp.techStack || ["Java", "Spring Boot", "React.js", "SQL"];

          return (
            <div className="exp-card" key={exp.id || index}>
              
              {/* Header Layout Wrapper */}
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
                
                <span className="exp-duration">{exp.duration || exp.timeline}</span>
              </div>

              {/* Description Bullet Points */}
              {(exp.descriptionPoints || exp.points) && (exp.descriptionPoints || exp.points).length > 0 && (
                <ul className="exp-points">
                  {(exp.descriptionPoints || exp.points).map((point, i) => (
                    <li key={i}>{point.trim()}</li>
                  ))}
                </ul>
              )}
              
              {/* Tech Skill Badges */}
              {skillBadges && skillBadges.length > 0 && (
                <div className="exp-tech-tags">
                  {skillBadges.map((skill, i) => (
                    <span className="tech-tag" key={i}>{skill.trim()}</span>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>      
    </div>
  );
};

export default Experience;