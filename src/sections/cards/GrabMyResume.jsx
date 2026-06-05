import React, { useState } from 'react';
import './GrabMyResume.css';

const GrabMyResume = ({ resumes = [] }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Locates the object marked active from your API array, fallback to index 0
  const activeResume = resumes?.find(r => r.active) || resumes?.[0];
  
  // Set structural fallbacks
  console.log(resumes)
  const resumeUrl = activeResume?.downloadUrl || "/Shubham_Makode_Resume.pdf";
  const documentTitle = activeResume?.title || "Shubham_Makode_Resume";

  // Google Drive viewing proxy wrapper to bypass iframe display restriction headers if hosted on cloud
  const iframeUrl = resumeUrl.includes('drive.google.com')
    ? resumeUrl.replace('/view', '/preview')
    : `${resumeUrl}#toolbar=0&navpanes=0`;

  return (
    <>
      <div className="resume-container">

        {/* Left Side: Text and Actions Group */}
        <div className="resume-info">
          <h1 className="resume-heading">Looking for a Full Stack Developer?</h1>
          <p className="resume-subheading">
            I build scalable web architectures with Spring Boot & React, and smooth cross-platform mobile apps with Flutter. Download my full resume to see my detailed project history, technical expertise, and academic background.
          </p>

          <div className="resume-actions">
            {/* Download Action Button */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              download={`${documentTitle}.pdf`}
              className="resume-btn download-btn"
            >
              <span className="btn-icon">📥</span> Download PDF
            </a>

            {/* Interactive State-Driven Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`resume-btn preview-btn ${showPreview ? 'active' : ''}`}
            >
              <span className="btn-icon">👁️</span> {showPreview ? 'Hide Preview' : 'Preview Resume'}
            </button>
          </div>
        </div>

        {/* Right Side: Quick Highlights Column */}
        <div className="resume-highlights">
          <h3>Quick Highlights</h3>
          <ul>
            <li>
              <strong>Core Languages</strong>
              Java, C++, JavaScript, SQL, Dart
            </li>
            <li>
              <strong>Frameworks</strong>
              Spring Boot, React.js, Flutter, Java EE
            </li>
            <li>
              <strong>Databases & DevOps</strong>
              MySQL, PostgreSQL, Docker
            </li>
          </ul>
        </div>

      </div>

      {/* Embedded Document Frame Panel (Driven seamlessly by your CSS definitions) */}
      {showPreview && (
        <div className="resume-preview-panel">
          <div className="preview-header">
            <span>LIVE PREVIEW: {documentTitle.toUpperCase()}.PDF</span>
            <button className="close-preview" onClick={() => setShowPreview(false)}>
              ✕ Close
            </button>
          </div>
          <iframe
            src={iframeUrl}
            title="Shubham Makode Portfolio Resume Preview Document"
            className="resume-iframe"
          />
        </div>
      )}
    </>
  );
};

export default GrabMyResume;