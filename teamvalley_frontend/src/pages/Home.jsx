import React from "react"; // Importon React që të krijojmë komponentin
import "../styles/Home.css"; // Lidh CSS-in e Home page me këtë komponent

function Home() { // Krijon komponentin Home
  return ( // Kthen pamjen që do shfaqet në browser
    <div className="home-page"> {/* Mbështjell gjithë faqen Home */}

      <section className="hero-section"> {/* Seksioni kryesor i faqes */}
        <div className="hero-content"> {/* Mbajtës për tekstin dhe butonat */}

          <span className="hero-badge">TeamValley Job Portal</span> {/* Etiketë e vogël sipër titullit */}

          <h1>Find the right job for your future</h1> {/* Titulli kryesor i faqes */}

          <p> {/* Përshkrimi i shkurtër i platformës */}
            TeamValley helps candidates find jobs and companies find the right talent.
          </p>

          <div className="hero-buttons"> {/* Mbajtës për butonat */}
            <button className="primary-btn">Find Jobs</button> {/* Butoni për të kërkuar punë */}
            <button className="secondary-btn">Post a Job</button> {/* Butoni për kompani që postojnë punë */}
          </div>

        </div>

        <div className="hero-card"> {/* Kartë informative në anën e djathtë */}
          <h3>New Opportunities</h3> {/* Titulli i kartës */}
          <p>120+ active job positions</p> {/* Tekst informues për punët aktive */}
          <p>50+ registered companies</p> {/* Tekst informues për kompanitë */}
          <p>Fast and simple application process</p> {/* Tekst informues për aplikimin */}
        </div>
      </section>

      <section className="search-section"> {/* Seksioni i kërkimit */}
        <input type="text" placeholder="Search job title..." /> {/* Input për titull pune */}
        <input type="text" placeholder="Location..." /> {/* Input për vendndodhje */}
        <button>Search</button> {/* Butoni për kërkim */}
      </section>

      <section className="categories-section"> {/* Seksioni i kategorive */}
        <h2>Popular Job Categories</h2> {/* Titulli i seksionit */}

        <div className="category-grid"> {/* Grid për kategoritë */}
          <div className="category-card">IT & Software</div> {/* Kategori pune */}
          <div className="category-card">Marketing</div> {/* Kategori pune */}
          <div className="category-card">Finance</div> {/* Kategori pune */}
          <div className="category-card">Design</div> {/* Kategori pune */}
        </div>
      </section>

      <section className="how-section"> {/* Seksioni si funksionon */}
        <h2>How TeamValley Works</h2> {/* Titulli i seksionit */}

        <div className="steps-grid"> {/* Grid për hapat */}
          <div className="step-card"> {/* Karta e hapit të parë */}
            <h3>1. Create Profile</h3> {/* Titulli i hapit */}
            <p>Candidates create a professional profile and upload their CV.</p> {/* Përshkrimi */}
          </div>

          <div className="step-card"> {/* Karta e hapit të dytë */}
            <h3>2. Apply for Jobs</h3> {/* Titulli i hapit */}
            <p>Candidates search jobs and apply directly from the platform.</p> {/* Përshkrimi */}
          </div>

          <div className="step-card"> {/* Karta e hapit të tretë */}
            <h3>3. Manage Applications</h3> {/* Titulli i hapit */}
            <p>Companies review applications and manage candidate status.</p> {/* Përshkrimi */}
          </div>
        </div>
      </section>

    </div>
  ); 
} 

export default Home; 