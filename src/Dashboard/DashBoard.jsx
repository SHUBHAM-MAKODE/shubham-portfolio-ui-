import React, { useState } from 'react' // Added useState
import PrismBackground from '../Background/PrismBackground.'
import './DashBoard.css'
import Hero from '../sections/Hero'
import About from '../sections/About'
import WhatIdo from '../sections/WhatIdo'
import Qualification from '../sections/Qualification'
import Work from '../sections/Work'
import Contact from '../sections/Contact'
import Footer from '../sections/Footer'
import { usePublicPortfolio } from '../contexts/PublicContext'

const DashBoard = () => {
    const { hubData } = usePublicPortfolio();
    const { roles, education, experiences, projects, resumes, services, skills, loading } = hubData || {};
    
    // State to handle opening and closing of mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="dashboard-layout">
            <div className="background-layer">
                <PrismBackground />
            </div>
            <div className="content-layer">
                
                {/* Navbar section */}
                <div className="nav-container"> {/* Fixed typo: nav-continer -> nav-container */}
                    <div className="logo">
                        Shubham Makode {/* Fixed typo: Shuham -> Shubham */}
                    </div>
                    
                    {/* The menu links toggle class based on state */}
                    <div className={`nav-link ${isMenuOpen ? 'active' : ''}`}>
                        <a href="#hero" onClick={() => setIsMenuOpen(false)}>Home</a>
                        <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
                        <a href="#passion" onClick={() => setIsMenuOpen(false)}>Passion</a>
                        <a href="#experience" onClick={() => setIsMenuOpen(false)}>Qualifications</a>
                        <a href="#work" onClick={() => setIsMenuOpen(false)}>Work</a>
                        <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
                    </div>

                    {/* 3-Line Hamburger Button */}
                    <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>

                <div id="hero" className='block-container'>
                    <Hero roles={roles}/>
                </div> 
                <div id="about" className='block-container'>
                    <About />
                </div> 
                <div id="passion" className='block-container'>
                    <WhatIdo services={services}/>
                </div>
                <div id="experience" className='block-container'>
                    <Qualification data={{experiences,education,resumes,skills}} />
                </div>
                <div id="work" className='block-container'>
                    <Work projects={projects} />
                </div>
                <div id="contact" className='block-container'>
                    <Contact />
                </div>
                <div id="footer" className='footer-cont'>
                    <Footer resumes={resumes}/>
                </div>
            </div>
        </div>
    )
}

export default DashBoard;