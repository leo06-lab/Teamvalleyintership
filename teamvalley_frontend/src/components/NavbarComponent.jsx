import React from "react"; // Importon React
import { NavLink } from "react-router-dom"; // Importon NavLink për navigim pa reload
import "../styles/Navbar.css"; // Importon CSS-in e navbar-it

function NavbarComponent() { // Krijon komponentin Navbar
  return ( // Kthen navbar-in në browser
    <nav className="navbar"> {/* Navbar kryesor */}

      <NavLink to="/" className="navbar-logo"> {/* Logo që të çon te Home */}
        <span className="logo-symbol"> {/* Mbajtësi i ikonës së logos */}
          <span className="logo-check-small"></span> {/* Pjesa e vogël e shenjës */}
          <span className="logo-check-big"></span> {/* Pjesa e madhe e shenjës */}
        </span>

        <span className="logo-name">JobValley</span> {/* Emri i platformës */}
      </NavLink>

      <ul className="navbar-links"> {/* Lista e linkeve kryesore */}

        <li> {/* Link Home */}
          <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
            Home
          </NavLink>
        </li>

        <li> {/* Link About */}
          <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>
            About
          </NavLink>
        </li>

        <li> {/* Link Find a Job */}
          <NavLink to="/jobs" className={({ isActive }) => isActive ? "active-link" : ""}>
            Find a Job
          </NavLink>
        </li>

        <li> {/* Link Contact */}
          <NavLink to="/contact" className={({ isActive }) => isActive ? "active-link" : ""}>
            Contact
          </NavLink>
        </li>

      </ul>

      <div className="navbar-actions"> {/* Butonat djathtas */}
        <NavLink to="/register" className="register-link">Register</NavLink> {/* Register */}
        <NavLink to="/login" className="signin-btn">Sign in</NavLink> {/* Sign in */}
      </div>

    </nav>
  ); // Mbyll return
} // Mbyll komponentin

export default NavbarComponent; // Eksporton NavbarComponent