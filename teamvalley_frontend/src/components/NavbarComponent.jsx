import React from "react"; // Importon React
import { NavLink } from "react-router-dom"; // Importon NavLink për navigim pa refresh
import "../styles/Navbar.css"; // Importon CSS-in e navbar-it

function NavbarComponent() { // Krijon komponentin Navbar
  return ( // Kthen pamjen e navbar-it
    <nav className="navbar"> {/* Navbar kryesor */}

      <NavLink to="/" className="navbar-logo"> {/* Logo që të çon te Home */}
        <span className="logo-icon">◆</span> {/* Ikona e logos */}
        <span className="logo-name">JobValley</span> {/* Emri i faqes */}
      </NavLink>

      <ul className="navbar-links"> {/* Lista e linkeve kryesore */}
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
            Home
          </NavLink>
        </li> {/* Link për Home */}

        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>
            About
          </NavLink>
        </li> {/* Link për About */}

        <li>
          <NavLink to="/jobs" className={({ isActive }) => isActive ? "active-link" : ""}>
            Find a Job
          </NavLink>
        </li> {/* Link për vendet e punës */}

        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "active-link" : ""}>
            Contact
          </NavLink>
        </li> {/* Link për Contact */}
      </ul>

      <div className="navbar-actions"> {/* Butonat në të djathtë */}
        <NavLink to="/register" className="register-link">Register</NavLink> {/* Link Register */}
        <NavLink to="/login" className="signin-btn">Sign in</NavLink> {/* Link Sign in */}
      </div>

    </nav>
  ); // Mbyll return
} // Mbyll komponentin

export default NavbarComponent; // Eksporton NavbarComponent