import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function NavbarComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedUser, setLoggedUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("jobvalleyUser"));
    setLoggedUser(userFromStorage);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("jobvalleyToken");
    localStorage.removeItem("jobvalleyUser");
    setLoggedUser(null);
    setMenuOpen(false);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (loggedUser?.role === "admin") {
      return "/admin-dashboard";
    }

    if (loggedUser?.role === "company") {
      return "/company-dashboard";
    }

    if (loggedUser?.role === "candidate") {
      return "/candidate/dashboard";
    }

    return "/";
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>JV</span>
          <strong>Job Valley</strong>
        </Link>

        <div className={menuOpen ? "navbar-links show-menu" : "navbar-links"}>
          <NavLink to="/" className="navbar-link">
            Home
          </NavLink>
          <NavLink to="/about" className="navbar-link">
            About
          </NavLink>
          <NavLink to="/jobs" className="navbar-link">
            Find a Job
          </NavLink>
          <NavLink to="/contact" className="navbar-link">
            Contact
          </NavLink>
        </div>

        <div className="navbar-actions">
          {loggedUser ? (
            <>
              <button
                type="button"
                className="navbar-dashboard-btn"
                onClick={() => navigate(getDashboardPath())}
              >
                Dashboard
              </button>
              <button
                type="button"
                className="navbar-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className="navbar-start-btn"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          )}
        </div>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}

export default NavbarComponent;
