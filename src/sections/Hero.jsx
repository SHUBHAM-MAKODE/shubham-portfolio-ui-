import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import './Hero.css';

const Hero = ({ roles = [] }) => {
    const el = useRef(null);

    // Baseline fallbacks if parent data is empty or hasn't loaded yet
    const displayRoles = roles.length > 0
        ? roles
        : ["Software Developer", "Full Stack Developer", "Software Engineer", "Java Developer"];

    useEffect(() => {
        // Prevent initializing Typed if the DOM reference or string array isn't ready
        if (!el.current || displayRoles.length === 0) return;

        const typed = new Typed(el.current, {
            strings: displayRoles,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
        });

        // Cleanup instance on unmount to avoid memory leaks or duplicate typing instances
        return () => typed.destroy();
    }, [roles]); // Re-runs layout binding cleanly if the parent updates the dataset dynamically

    return (
        <div className="hero-section-bg">
            <div className="hero-text-content">
                <h1>Hi,</h1>
                <h2>
                    It's me, <span>Shubham Makode</span>
                </h2>

                <p>
                    Designation: <span ref={el} className="rotating-words"></span>
                </p>

                <span className="arrow-down">v</span>
            </div>

            <div className="hero-img">
                <img src={"https://res.cloudinary.com/dl5e6thva/image/upload/v1779995565/portfolio/projects/nfyztcyf711mxtx87slt.png"} alt="Shubham Makode" />
            </div>
        </div>
    );
};

export default Hero;