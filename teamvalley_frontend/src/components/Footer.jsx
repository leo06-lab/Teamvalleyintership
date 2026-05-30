import React from "react"; // Importon React
import { NavLink } from "react-router-dom"; // Importon NavLink për navigim
import "../styles/Footer.css"; // Importon CSS-in e footer-it

function Footer() { // Krijon komponentin Footer
  return ( // Kthen pamjen në browser
    <footer className="footer"> {/* Footer kryesor */}

      <div className="footer-top"> {/* Pjesa kryesore e footer-it */}

        <div className="footer-brand"> {/* Kolona e logos dhe përshkrimit */}
          <NavLink to="/" className="footer-logo"> {/* Logo që të çon te Home */}
            <span className="footer-logo-icon">◆</span> {/* Ikona e logos */}
            <span className="footer-logo-name">JobValley</span> {/* Emri i platformës */}
          </NavLink>

          <p> {/* Përshkrimi i shkurtër */}
            JobValley helps candidates find jobs and companies discover the right talent faster.
          </p>

          <div className="footer-socials"> {/* Ikonat sociale */}
            <a href="/">f</a> {/* Facebook */}
            <a href="/">in</a> {/* LinkedIn */}
            <a href="/">x</a> {/* Twitter/X */}
          </div>
        </div>

        <div className="footer-column"> {/* Kolona navigation */}
          <h3>Navigation</h3> {/* Titulli i kolonës */}
          <NavLink to="/">Home</NavLink> {/* Link Home */}
          <NavLink to="/about">About</NavLink> {/* Link About */}
          <NavLink to="/jobs">Find a Job</NavLink> {/* Link Jobs */}
          <NavLink to="/contact">Contact</NavLink> {/* Link Contact */}
        </div>

        <div className="footer-column"> {/* Kolona për kandidatë */}
          <h3>For Candidates</h3> {/* Titulli */}
          <NavLink to="/jobs">Browse Jobs</NavLink> {/* Link Jobs */}
          <NavLink to="/register">Create Profile</NavLink> {/* Link Register */}
          <NavLink to="/login">Sign In</NavLink> {/* Link Login */}
          <NavLink to="/contact">Support</NavLink> {/* Link Support */}
        </div>

        <div className="footer-newsletter"> {/* Kolona newsletter */}
          <h3>Stay Updated</h3> {/* Titulli */}
          <p>Get updates about new jobs and career opportunities.</p> {/* Përshkrimi */}

          <div className="newsletter-box"> {/* Kutia e email-it */}
            <input type="email" placeholder="Enter your email" /> {/* Input email */}
            <button>Subscribe</button> {/* Buton subscribe */}
          </div>
        </div>

      </div>

      <div className="footer-bottom"> {/* Pjesa fundore */}
        <p>© 2026 JobValley. All rights reserved.</p> {/* Copyright */}
        <div> {/* Linke fundore */}
          <a href="/">Privacy Policy</a> {/* Privacy */}
          <a href="/">Terms</a> {/* Terms */}
        </div>
      </div>

    </footer>
  ); // Mbyll return
} // Mbyll komponentin

export default Footer; // Eksporton Footer