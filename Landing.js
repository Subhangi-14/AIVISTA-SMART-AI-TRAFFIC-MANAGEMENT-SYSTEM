import React from "react";
import "./Landing.css"; // custom CSS for landing page

function Landing({ onEnter }) {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">🚦 Welcome to AIVISTA</h1>
        <p className="landing-tagline">
          Next-Gen AI Automated Smart Traffic Management Solution
        </p>

        <div className="landing-buttons">
          <button className="primary-btn" onClick={onEnter}>
            Go to Dashboard
          </button>
          <button
            className="secondary-btn"
            onClick={() => alert("📊 Real-time traffic monitoring coming soon!")}
          >
            Live Traffic
          </button>
          <button
            className="secondary-btn"
            onClick={() => alert("📍 Smart Route Planner under development!")}
          >
            Route Planner
          </button>
          <button
            className="secondary-btn"
            onClick={() => alert("ℹ️ About AIVISTA: AI-powered traffic optimization system.")}
          >
            About Us
          </button>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h3>✨ Key Features</h3>
          <ul>
            <li>🚥 AI-powered smart traffic light control</li>
            <li>📊 Real-time congestion analysis</li>
            <li>🌍 Route optimization & eco-friendly driving</li>
            <li>📡 IoT sensor & camera integration</li>
            <li>🔒 Secure & scalable cloud dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Landing;
