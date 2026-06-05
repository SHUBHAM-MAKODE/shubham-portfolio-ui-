import React, { useState, useEffect } from 'react';
import API from '../services/api'; // 1. Hook up our custom JWT Axios instance

const DashboardOverview = ({ setActiveTab }) => {
  // 2. State engines for our dynamic data tracks
  const [counts, setCounts] = useState({ projects: 0, experiences: 0, messages: 0, skills: 0 });
  const [messagesList, setMessagesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardOverviewData = async () => {
      try {
        // 3. Fire parallel requests to populate metric counts and table cells
        const [projectsRes, experiencesRes, skillsRes, messagesRes] = await Promise.all([
          API.get('/projects/all'),
          API.get('/experiences/all'),
          API.get('/skills/all'),
          API.get('/messages/all').catch(() => ({ data: { data: [] } })) // Fallback guard if route is missing
        ]);

        const totalProjects = projectsRes.data?.data?.length || 0;
        const totalExperiences = experiencesRes.data?.data?.length || 0;
        const totalSkills = skillsRes.data?.data?.length || 0;
        const allMessages = messagesRes.data?.data || [];

        // Update calculations state
        setCounts({
          projects: totalProjects,
          experiences: totalExperiences,
          skills: totalSkills,
          messages: allMessages.filter(m => !m.isRead).length // Filters unread counts dynamically
        });

        // Take only the top 3 most recent contact documents for dashboard layout
        setMessagesList(allMessages.slice(0, 3));

      } catch (err) {
        console.error("Error populating system metrics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardOverviewData();
  }, []);

  // 4. Map the state parameters onto the component layout arrays
  const statsLayout = [
    { title: "Total Projects", count: counts.projects, icon: "💻", change: "Live project count" },
    { title: "Experience Items", count: counts.experiences, icon: "💼", change: "Active timeline" },
    { title: "Unread Messages", count: counts.messages, icon: "📩", change: "Requires action", alert: counts.messages > 0 },
    { title: "Skill Matrix Tags", count: counts.skills, icon: "🛠️", change: "Tech capabilities" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="text-sm font-semibold tracking-wider animate-pulse">Synchronizing Data Node Matrix...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-view-fade">
      {/* Analytics Stats Grid */}
      <section className="stats-grid">
        {statsLayout.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className={`stat-change ${stat.alert ? 'alert-txt' : ''}`}>{stat.change}</span>
            </div>
            <h3>{stat.count}</h3>
            <p>{stat.title}</p>
          </div>
        ))}
      </section>

      {/* Main Workspace Split Grid */}
      <section className="dashboard-workspace-split">
        <div className="workspace-panel">
          <h3>Recent Contact Inquiries</h3>
          <div className="table-responsive">
            <table className="custom-dashboard-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {messagesList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-500 text-sm">
                      Inbox is empty. No contact inquiries received yet.
                    </td>
                  </tr>
                ) : (
                  messagesList.map((msg) => (
                    <tr key={msg.id}>
                      <td>
                        <div className="table-sender-name">{msg.name}</div>
                        <div className="table-sender-subtext">{msg.email}</div>
                      </td>
                      <td>{msg.subject}</td>
                      <td>{msg.date || new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="table-action-btn view" onClick={() => setActiveTab('Messages-Inbox')}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="workspace-panel short-panel">
          <h3>Quick Shell Prompts</h3>
          <div className="quick-actions-list">
            <button className="quick-action-row-btn" onClick={() => setActiveTab('projects')}>
              <span>➕ Add New Project Entry</span> ➔
            </button>
            <button className="quick-action-row-btn" onClick={() => setActiveTab('experience')}>
              <span>➕ Add Career Milestone</span> ➔
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;