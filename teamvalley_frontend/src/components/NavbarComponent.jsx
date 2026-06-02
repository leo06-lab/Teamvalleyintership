import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function NavbarComponent() {
  return (
    <nav className="jv-navbar">
      <NavLink to="/" className="jv-navbar-logo">
        <span className="jv-logo-symbol">
          <span className="jv-logo-check-small"></span>
          <span className="jv-logo-check-big"></span>
        </span>

        <span className="jv-logo-name">JobValley</span>
      </NavLink>

      <ul className="jv-navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "jv-active-link" : ""}>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? "jv-active-link" : ""}>
            About
          </NavLink>
        </li>

        <li>
          <NavLink to="/jobs" className={({ isActive }) => isActive ? "jv-active-link" : ""}>
            Find a Job
          </NavLink>
        </li>

        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "jv-active-link" : ""}>
            Contact
          </NavLink>
        </li>
      </ul>

      <div className="jv-navbar-actions">
        <NavLink to="/register" className="jv-register-link">
          Register
        </NavLink>

        <NavLink to="/login" className="jv-signin-btn">
          Sign in
        </NavLink>
      </div>
    </nav>
  );
}

export default NavbarComponent;