import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Container, Row, Col, Nav } from "react-bootstrap";
import "../../styles/CandidateDashboard.css";

function CandidateLayout() {
  return (
    <Container fluid className="candidate-shell">
      <Row className="candidate-row g-4 p-4 rounded-4 shadow-sm">
        <Col md={3} lg={2} className="candidate-sidebar rounded-4 border-0 shadow-sm">
          <div className="sidebar-top">
            <div className="sidebar-brand px-2">
              <div className="brand-badge">JV</div>
              <div>
                <h3 className="mb-0">JobValley</h3>
              </div>
            </div>

            <Nav className="flex-column sidebar-nav px-2">
              <NavLink to="/candidate/dashboard" className="sidebar-link">
                <i className="bi bi-house me-2"></i>
                Dashboard
              </NavLink>
              <NavLink to="/candidate/profile" className="sidebar-link">
                <i className="bi bi-person me-2"></i>
                My Profile
              </NavLink>
              <NavLink to="/candidate/applications" className="sidebar-link">
                <i className="bi bi-file-earmark-text me-2"></i>
                My Applications
              </NavLink>
              <NavLink to="/candidate/saved-jobs" className="sidebar-link">
                <i className="bi bi-bookmark me-2"></i>
                Saved Jobs
              </NavLink>
              <NavLink to="/candidate/upload-cv" className="sidebar-link">
                <i className="bi bi-upload me-2"></i>
                Upload CV
              </NavLink>
            </Nav>
          </div>
        </Col>

        <Col md={9} lg={10} className="candidate-content">
          <div className="candidate-topbar rounded-4 border-0 shadow-sm custom-bg">
            <div>
              <h4 className="mb-1">Welcome back, Eljon</h4>
              <p className="text-muted mb-0">
                Manage your profile, applications, saved jobs and uploaded CV in one place.
              </p>
            </div>
          </div>

          <div className="candidate-page">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CandidateLayout;