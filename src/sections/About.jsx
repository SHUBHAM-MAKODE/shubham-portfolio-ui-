import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-section-bg">
      <div className="about-heading">
        About Me
      </div>

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
            focusing on clean design, strong functionality, and seamless user
            experiences.
          </p>

          <h2>
            When I'm not coding, I enjoy watching anime, exploring new
            technologies, and spending quality time with friends.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default About;