import React from 'react';
import './WhatIdo.css';
import WhatIdoCard from './cards/WhatIdoCard';

const WhatIdo = ({ services = [] }) => {

    // Fallback data structure if parent passes an empty array or hasn't loaded yet
    const staticFallbackServices = [
        {
            logoUrl: '/icons/freelancer.png',
            title: "Web Development",
            description: "Design and develop responsive, scalable, and user-friendly web applications using React.js, Spring Boot, Java, and MySQL with a focus on clean architecture and performance."
        },
        {
            logoUrl: "/icons/smartphone.png",
            title: "Mobile App Development",
            description: "Build cross-platform mobile applications with Flutter, delivering smooth and consistent experiences on both Android and iOS platforms."
        },
        {
            logoUrl: "/icons/coding.png",
            title: "Backend Development",
            description: "Create robust REST APIs and server-side applications using Spring Boot and Java, with an emphasis on security, scalability, and maintainable code."
        },
        {
            logoUrl: "/icons/database.png",
            title: "Database Design",
            description: "Design efficient database structures and write optimized queries using MySQL to ensure reliable and high-performance data management."
        }
    ];

    // Select between parent passed data or baseline fallback values
    const displayServices = services && services.length > 0 ? services : staticFallbackServices;

    return (
        <div className='whatido-section-bg '>

            {/* Foreground Content Card Grid Wrapper */}
            
                <div className="whatido-heading">
                    What I Do
                </div>

                {/* Standard, browser-native scrollable container */}
                <div className="whatIdo-card-container">
                    {displayServices.map((item, index) => (
                        <WhatIdoCard
                            key={item.id || index}
                            imageUrl={item.logoUrl || item.imageUrl}
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
            </div>

    );
};

export default WhatIdo;