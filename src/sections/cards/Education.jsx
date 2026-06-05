import React, { useState } from 'react';
import './Education.css';

const Education = ({ education = [] }) => {
    const [expandedIndex, setExpandedIndex] = useState(0);

    // Static fallback array mirroring your real-world academic profile if parent passes an empty dataset
    const fallbackEducation = [
        {
            degree: "Master of Technology (M.Tech) in Computer Science & Engineering",
            institution: "Patel Institute of Science and Technology",
            location: "Bhopal, MP",
            duration: "2024 - 2027 (Expected)",
            grade: "Pursuing",
            details: [
                "Specializing in advanced computing systems, cloud infrastructure paradigms, and enterprise software engineering structures.",
                "Balancing rigorous academic coursework alongside active full-stack application development cycles."
            ]
        },
        {
            degree: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
            institution: "Oriental Institute of Science and Technology",
            location: "Bhopal, MP",
            duration: "2020 - 2024",
            grade: "Graduated , 7.32 (CGPA)",
            details: [
                "Gained deep foundation in core computer science primitives including Data Structures & Algorithms (DSA), Database Management Systems (DBMS), and Object-Oriented Programming (OOPs).",
                "Completed multiple capstone development projects executing full-stack web and mobile architectures."
            ]
        }
    ];

    // Dynamically switch down to default hardcoded matrices if data is unpopulated
    const displayEducation = education && education.length > 0 ? education : fallbackEducation;

    
    const toggleAccordion = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className='edu-display'>
            <h1 className="edu-heading">Education History</h1>

            <div className='edu-accordion-container'>
                {displayEducation.map((edu, index) => {
                    const isExpanded = expandedIndex === index;
                    return (
                        <div className={`accordion-item ${isExpanded ? 'active' : ''}`} key={edu.id || index}>

                            {/* Accordion Toggle Header */}
                            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                                <div className="edu-logo-fallback">🎓</div>
                                <div className="header-info">
                                    <h2>{edu.degree}</h2>
                                    <h3>{edu.institution} • <span className="location-type">{edu.location || edu.campusLocation}</span></h3>
                                </div>
                                <div className="header-right">
                                    <span className="edu-duration">{edu.duration || edu.timeline}</span>
                                    <span className="accordion-icon">{isExpanded ? '▲' : '▼'}</span>
                                </div>
                            </div>

                            {/* Accordion Collapsible Panel Content */}
                            <div className={`accordion-content ${isExpanded ? 'show' : ''}`}>
                                <div className="edu-performance">
                                    <strong>Status/Grade:</strong> <span className="grade-badge">{edu.grade || edu.performanceMetric || 'Completed'}</span>
                                </div>
                                {edu.details && edu.details.length > 0 && (
                                    <ul className="edu-points">
                                        {edu.details.map((point, i) => (
                                            <li key={i}>{point.trim()}</li>
                                        ))}
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

export default Education;