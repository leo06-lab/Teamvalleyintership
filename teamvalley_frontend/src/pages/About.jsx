import React from "react"; // Importon React
import "../styles/About.css"; // Importon CSS-in e About page
import homePageImage from "../assets/images/homepage.png"; // Përdorim foton ekzistuese nga assets

function About() { // Krijon komponentin About
  return ( // Kthen pamjen në browser
    <main className="about-page"> {/* Faqja kryesore About */}

      <section className="about-hero"> {/* Seksioni kryesor i About */}
        <div className="about-hero-left"> {/* Ana e majtë me tekst */}
          <span className="about-label">About Us</span> {/* Label i vogël */}
          <h1>Empowering People Through Better Careers</h1> {/* Titulli kryesor */}
          <p>
            JobValley is a digital recruitment platform that connects job seekers
            with companies through a simple, structured and professional system.
          </p> {/* Përshkrimi i platformës */}
        </div>

        <div className="about-hero-right"> {/* Ana e djathtë me imazh */}
          <div className="about-image-card"> {/* Karta e imazhit */}
            <img src={homePageImage} alt="JobValley About" /> {/* Fotoja */}
          </div>
        </div>
      </section>

      <section className="mission-section"> {/* Seksioni mission/vision */}
        <div className="mission-card"> {/* Karta e misionit */}
          <div className="mission-icon">◎</div> {/* Ikona */}
          <h3>Our Mission</h3> {/* Titulli */}
          <p>
            To make job searching and recruitment easier, faster and more organized
            for both candidates and companies.
          </p> {/* Teksti */}
        </div>

        <div className="mission-card"> {/* Karta e vizionit */}
          <div className="mission-icon">◉</div> {/* Ikona */}
          <h3>Our Vision</h3> {/* Titulli */}
          <p>
            To build a modern recruitment platform that reflects real SaaS
            standards and professional web development practices.
          </p> {/* Teksti */}
        </div>
      </section>

      <section className="why-section"> {/* Seksioni pse JobValley */}
        <div className="section-heading"> {/* Titulli i seksionit */}
          <h2>Why Choose JobValley?</h2> {/* Titulli */}
          <p>Simple tools for candidates, companies and admins.</p> {/* Përshkrimi */}
        </div>

        <div className="why-grid"> {/* Grid me kartat */}
          <div className="why-card"> {/* Karta 1 */}
            <span>▣</span> {/* Ikona */}
            <h3>Thousands of Jobs</h3> {/* Titulli */}
            <p>Access job opportunities from different companies and industries.</p> {/* Përshkrimi */}
          </div>

          <div className="why-card"> {/* Karta 2 */}
            <span>↗</span> {/* Ikona */}
            <h3>Smart Matching</h3> {/* Titulli */}
            <p>Connect candidates with the right job positions faster.</p> {/* Përshkrimi */}
          </div>

          <div className="why-card"> {/* Karta 3 */}
            <span>▤</span> {/* Ikona */}
            <h3>Career Growth</h3> {/* Titulli */}
            <p>Help candidates build profiles, upload CVs and apply easily.</p> {/* Përshkrimi */}
          </div>

          <div className="why-card"> {/* Karta 4 */}
            <span>◇</span> {/* Ikona */}
            <h3>Trusted Platform</h3> {/* Titulli */}
            <p>Companies can publish jobs and manage applications in one place.</p> {/* Përshkrimi */}
          </div>
        </div>
      </section>

      <section className="stats-section"> {/* Seksioni i statistikave */}
        <div className="stat-box"> {/* Statistika 1 */}
          <h2>10k+</h2> {/* Numri */}
          <p>Job Opportunities</p> {/* Teksti */}
        </div>

        <div className="stat-box"> {/* Statistika 2 */}
          <h2>5k+</h2> {/* Numri */}
          <p>Companies</p> {/* Teksti */}
        </div>

        <div className="stat-box"> {/* Statistika 3 */}
          <h2>50k+</h2> {/* Numri */}
          <p>Happy Users</p> {/* Teksti */}
        </div>

        <div className="stat-box"> {/* Statistika 4 */}
          <h2>20+</h2> {/* Numri */}
          <p>Industries</p> {/* Teksti */}
        </div>
      </section>

    </main>
  ); // Mbyll return
} // Mbyll komponentin

export default About; // Eksporton About