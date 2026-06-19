import React from "react";
import "../styles/About.css";
import aboutValley from "../assets/images/aboutvalley.png";

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-left">
          <span className="about-label">About Us</span>

          <h1>Empowering People Through Better Careers</h1>

          <p>
            JobValley is a digital recruitment platform that connects job
            seekers with companies through a simple, structured and professional
            system.
          </p>
        </div>

        <div className="about-hero-right">
          <div className="about-image-card">
            <img src={aboutValley} alt="JobValley About" />
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-card">
          <div className="mission-icon">◎</div>

          <h3>Our Mission</h3>

          <p>
            To make job searching and recruitment easier, faster and more
            organized for both candidates and companies.
          </p>
        </div>

        <div className="mission-card">
          <div className="mission-icon">◉</div>

          <h3>Our Vision</h3>

          <p>
            To build a modern recruitment platform that reflects real SaaS
            standards and professional web development practices.
          </p>
        </div>
      </section>

      <section className="why-section">
        <div className="section-heading">
          <h2>Why Choose JobValley?</h2>
          <p>Simple tools for candidates, companies and admins.</p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <span>▣</span>

            <h3>Thousands of Jobs</h3>

            <p>
              Access job opportunities from different companies and industries.
            </p>
          </div>

          <div className="why-card">
            <span>↗</span>

            <h3>Smart Matching</h3>

            <p>Connect candidates with the right job positions faster.</p>
          </div>

          <div className="why-card">
            <span>▤</span>

            <h3>Career Growth</h3>

            <p>Help candidates build profiles, upload CVs and apply easily.</p>
          </div>

          <div className="why-card">
            <span>◇</span>

            <h3>Trusted Platform</h3>

            <p>
              Companies can publish jobs and manage applications in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-box">
          <h2>10k+</h2>
          <p>Job Opportunities</p>
        </div>

        <div className="stat-box">
          <h2>5k+</h2>
          <p>Companies</p>
        </div>

        <div className="stat-box">
          <h2>50k+</h2>
          <p>Happy Users</p>
        </div>

        <div className="stat-box">
          <h2>20+</h2>
          <p>Industries</p>
        </div>
      </section>
    </main>
  );
}

export default About;