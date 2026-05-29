import React from "react"; // Importon React për të krijuar komponentin
import "../styles/Navbar.css"; // Importon stilimin CSS për navbar-in

function NavbarComponent() { // Krijon komponentin NavbarComponent
  return ( // Kthen pamjen që do shfaqet në browser
    <nav className="navbar"> {/* Krijon navbar-in kryesor */}

      <div className="navbar-logo"> {/* Mbajtës për logon/emrin e faqes */}
        <span className="logo-icon">T</span> {/* Ikona e vogël e logos */}
        <h2>TeamValley</h2> {/* Emri i platformës */}
      </div>

      <ul className="navbar-links"> {/* Lista e linkeve të navigimit */}
        <li><a href="/">Home</a></li> {/* Link për faqen Home */}
        <li><a href="/jobs">Jobs</a></li> {/* Link për faqen Jobs */}
        <li><a href="/about">About</a></li> {/* Link për faqen About */}
        <li><a href="/contact">Contact</a></li> {/* Link për faqen Contact */}
      </ul>

      <div className="navbar-buttons"> {/* Mbajtës për butonat në navbar */}
        <a href="/login" className="login-btn">Login</a> {/* Butoni për login */}
        <a href="/register" className="register-btn">Register</a> {/* Butoni për register */}
      </div>

    </nav>
  ); // Mbyll return
} // Mbyll komponentin NavbarComponent

export default NavbarComponent; // Eksporton navbar-in që ta përdorim në App.js