import React from 'react';
import './Footer.css'; // Importing your dedicated standard CSS sheet

const Footer = ({resumes}) => {
  const currentYear = new Date().getFullYear();

  // Clean local public static path fallback
  const resumeUrl = resumes?.[0]?.downloadUrl ||"https://drive.google.com/file/d/1viFeqBKHsM0N7wvjGVtma18Yuk3bXF-9/view"; // Assuming resumes is an array of objects with a url property

  return (
    <footer className="portfolio-footer">
      <div className="footer-container">
        
        {/* Left Side: Brand Context Panel */}
        <div className="footer-brand">
          <div className="footer-logo-row">
            <span className="footer-logo-text">
              Shubham Makode
            </span>
            <span className="footer-badge">
              Full Stack Developer
            </span>
          </div>
          <p className="footer-copyright">
            &copy; {currentYear} All rights reserved. Architected with Spring Boot & React.
          </p>
        </div>

        {/* Right Side: Quick Navigation Links */}
        <div className="footer-links">
          <a href="#projects" className="footer-link">
            Projects
          </a>
          <a href="#experience" className="footer-link">
            Experience
          </a>
          <a 
            href={resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link external"
          >
            <span>Resume</span>
            <span className="footer-link-arrow">↗</span>
          </a>
          <a 
            href="https://github.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;