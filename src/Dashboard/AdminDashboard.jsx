import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import DashboardOverview from '../Admin/DashBoardOverview';
import ManageProjects from '../Admin/ManageProjet';
import ManageExperience from '../Admin/ManageExperience';
import ManageMessages from '../Admin/ManageMessages'; // FIXED: Imported your exact ManageMessages component
import ManageHero from '../Admin/ManageHero';
import ManageServices from '../Admin/ManageServices';
import ManageEducation from '../Admin/ManageEducation';
import ManageSkills from '../Admin/ManageSkills';
import ManageResumes from '../Admin/ManageResume';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');


  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard-container">

      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">⚡</span>
          <h2>Shubham.Dev</h2>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="menu-icon">📊</span> Overview
          </button>

          <button
            className={`menu-item ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <span className="menu-icon">🚀</span> Manage Hero Text
          </button>

          <button
            className={`menu-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <span className="menu-icon">🛠️</span> Manage Services
          </button>

          <button
            className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span className="menu-icon">📁</span> Manage Projects
          </button>

          <button
            className={`menu-item ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <span className="menu-icon">💼</span> Manage Experience
          </button>

          <button
            className={`menu-item ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <span className="menu-icon">🎓</span> Manage Education
          </button>

          <button
            className={`menu-item ${activeTab === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech')}
          >
            <span className="menu-icon">💻</span> Manage Skills
          </button>


          <button
            className={`menu-item ${activeTab === 'Grab-My-Resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('Grab-My-Resume')}
          >
            <span className="menu-icon">📄</span> Manage Resume
          </button>

          <button
            className={`menu-item ${activeTab === 'Messages-Inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('Messages-Inbox')}
          >
            <span className="menu-icon">📬</span> Messages Inbox
          </button>
        </nav>

        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <span className="menu-icon">🚪</span> Logout
        </button>
      </aside>

      {/* Main Workspace Workdesk */}
      <main className="dashboard-main-content">
        <header className="content-header">
          <div>
            <h1>Control Management Panel</h1>
            <p>Welcome back, Admin</p>
          </div>
          <div className="admin-status-pill">
            <span className="status-dot-green"></span> Live Server Mode
          </div>
        </header>

        {/* Conditional Panel Rendering Engine (Where the forms belong) */}
        {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
        {activeTab === 'hero' && <ManageHero />}
        {activeTab === 'services' && <ManageServices />}
        {activeTab === 'projects' && <ManageProjects />}
        {activeTab === 'experience' && <ManageExperience />}
        {activeTab === 'Messages-Inbox' && <ManageMessages />}
        {activeTab === 'education' && <ManageEducation />}
        {activeTab === 'tech' && <ManageSkills />}
        {activeTab === 'Grab-My-Resume' && <ManageResumes />}

      </main>
    </div>
  );
};

export default AdminDashboard;