import React, { useState } from 'react';
import './Qualification.css';
import Experience from './cards/Experience';
import Education from './cards/Education';
import TechWork from './cards/TechWork';
import GrabMyResume from './cards/GrabMyResume';


const Qualification = ({ data } = []) => {
  // Define an active state for switching tabs
  const { experiences, education, resumes, skills } = data || {};
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <div className='experience-section'>


      <div className='experience-section-bg'>

        <div className="experience-btn-container">
          <button
            className={activeTab === 'experience' ? 'active-btn' : ''}
            onClick={() => setActiveTab('experience')}
          >
            Experience
          </button>
          <button
            className={activeTab === 'education' ? 'active-btn' : ''}
            onClick={() => setActiveTab('education')}
          >
            Education
          </button>
          <button
            className={activeTab === 'tech' ? 'active-btn' : ''}
            onClick={() => setActiveTab('tech')}
          >
            Tech I Worked With
          </button>

          <button
            className={activeTab === 'Grab-My-Resume' ? 'active-btn' : ''}
            onClick={() => setActiveTab('Grab-My-Resume')}
          >
            Grab My Resume
          </button>
        </div>

        <div className='exp-display-block'>
          {activeTab === 'experience' && <Experience experiences={experiences} />}
          {activeTab === 'education' && <Education education={education} />}
          {activeTab === 'tech' && <TechWork skills={skills} />}
          {activeTab === 'Grab-My-Resume' && <GrabMyResume resumes={resumes} />}
        </div>

      </div>
    </div>
  );
};

export default Qualification;