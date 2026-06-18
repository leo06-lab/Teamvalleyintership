import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, ProgressBar, Badge, ListGroup, Spinner } from "react-bootstrap";
import api from "../../api/axios";
import "../../styles/CandidateDashboard.css";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [profileRes, applicationsRes, savedJobsRes] = await Promise.all([
          api.get("/candidate/profile"),
          api.get("/applications/my-applications"),
          api.get("/candidate/saved-jobs"),
        ]);

        setProfile(profileRes.data);
        setApplications(applicationsRes.data?.data || []);
        setSavedJobs(savedJobsRes.data?.data || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;

    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.address,
      profile.about,
      profile.skills && Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
      profile.education,
      profile.experience,
      profile.linkedin,
      profile.github,
      profile.portfolio,
      profile.cvUrl,
    ];

    const filled = fields.filter((value) => value && value.toString().trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const getStatusVariant = (status) => {
    if (status === "pending") return "warning";
    if (status === "interview") return "primary";
    if (status === "accepted") return "success";
    if (status === "rejected") return "danger";
    return "secondary";
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const interviewCount = applications.filter(
    (application) => application.status?.toLowerCase() === "interview"
  ).length;

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <div className="mt-3">Duke ngarkuar dashboard-in...</div>
      </div>
    );
  }

  const recentApplications = applications.slice(0, 3);

  return (
    <div className="dashboard-grid">
      <Card className="welcome-card mx-3 rounded-4 border-0 shadow-sm ">
        <div className="welcome-text ">
 
          <h2 className="mb-2">Build your next career step</h2>
          <p className="text-muted mb-3">
            Update your profile, upload your CV, and track job applications from one dashboard.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => navigate("/candidate/profile")}>Complete Profile</Button>
          <Button variant="outline-primary" onClick={() => navigate("/candidate/upload-cv")}>
            Upload CV
          </Button>
        </div>
      </Card>

      <Row className="g-3 mx-3">
        <Col xs={6} lg={3}>
          <Card className="stat-card rounded-4 shadow-sm border-0">
            <div className="stat-label">Applications</div>
            <div className="stat-value">{applications.length}</div>
            <div className="stat-note">All submitted applications</div>
          </Card>
        </Col>

        <Col  xs={6} lg={3}>
          <Card className="stat-card rounded-4 shadow-sm border-0">
            <div className="stat-label">Interviews</div>
            <div className="stat-value">{interviewCount}</div>
            <div className="stat-note">Current interview stage</div>
          </Card>
        </Col>

        <Col xs={6} lg={3}>
          <Card className="stat-card rounded-4 shadow-sm border-0">
            <div className="stat-label">Saved Jobs</div>
            <div className="stat-value">{savedJobs.length}</div>
            <div className="stat-note">Jobs you've saved</div>
          </Card>
        </Col>

        <Col xs={6} lg={3}>
          <Card className="stat-card rounded-4 shadow-sm border-0">
            <div className="stat-label">Profile Completion</div>
            <div className="stat-value">{profileCompletion}%</div>
            <div className="stat-note">
              {profile?.cvUrl ? "CV uploaded" : "CV missing"}
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mx-3">
        <Col xs={12} lg={7}>
          <Card className="panel-card rounded-4 shadow-sm border-0">
            <Card.Body>
              <div className="section-head">
                <h4 className="mb-0">Recent Applications</h4>
                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() => navigate("/candidate/applications")}
                >
                  See all
                </Button>
              </div>

              <ListGroup variant="flush" className="mt-3">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <ListGroup.Item key={app._id} className="recent-item">
                      <div>
                        <div className="fw-semibold">{app.jobTitle}</div>
                        <div className="text-muted small">
                          {(app.companyName || app.company?.companyName || "Company Account")} • {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge bg={getStatusVariant(app.status)}>{formatStatus(app.status)}</Badge>
                    </ListGroup.Item>
                  ))
                ) : (
                  <div className="text-muted py-3">No applications yet.</div>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={5}>
          <Card className="panel-card rounded-4 shadow-sm border-0 ">
            <Card.Body>
              <div className="section-head">
                <h4 className="mb-0">Profile Progress</h4>
                <span className="text-muted small">{profileCompletion}% complete</span>
              </div>

              <ProgressBar now={profileCompletion} className="mt-3 mb-3 progress-soft" />

              <div className="progress-list">
                <div>{profile?.fullName ? "✔" : "✖"} Personal details added</div>
                <div>{profile?.skills?.length > 0 ? "✔" : "✖"} Skills added</div>
                <div>{profile?.education ? "✔" : "✖"} Education added</div>
                <div>{profile?.cvUrl ? "✔" : "✖"} CV uploaded</div>
                <div>{profile?.portfolio ? "✔" : "✖"} Portfolio link added</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CandidateDashboard;