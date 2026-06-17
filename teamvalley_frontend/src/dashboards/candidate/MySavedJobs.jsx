import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function MySavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/candidate/saved-jobs");

        setSavedJobs(response.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <Container fluid className="px-0">
        <Card className="panel-card mx-3 rounded-4">
          <Card.Body className="text-center py-5">
            <Spinner animation="border" />
            <div className="mt-3">Duke ngarkuar saved jobs...</div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const deleteSavedJob = async (id) => {
    try {
      await api.delete(`/candidate/saved-jobs/${id}`);
      setSavedJobs((currentJobs) => currentJobs.filter((job) => job._id !== id));
    } catch (err) {
        setError(err.response?.data?.message || "Error deleting saved job.");
    }
  }

  return (
    <Container fluid className="px-0">
      <Card className="panel-card mx-3 rounded-4">
        <Card.Body className="py-4 custom-bg rounded-4">
          <div className="section-head mb-4">
            <div>
              <h3 className="mb-1">My Saved Jobs</h3>
              <p className="text-muted mb-0">Jobs you have saved for later review.</p>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {savedJobs.length === 0 ? (
            <div className="text-center text-muted py-5">
              No saved jobs yet.
            </div>
          ) : (
            <Row className="g-3">
              {savedJobs.map((job) => (
                <Col md={6} xl={4} key={job._id}>
                  <Card className="h-100 border-0 shadow-sm rounded-4">
                    <Card.Body className="d-flex flex-column justify-content-between shadow-sm rounded-4 custom">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-1">{job.jobTitle}</h5>
                            <div className="text-muted small">{job.companyName}</div>
                          </div>
                          <Badge bg="light" text="dark">Saved</Badge>
                        </div>

                        <p className="text-muted small mb-2">
                          Location: {job.location || "Not specified"}
                        </p>

                        <p className="text-muted small mb-0">
                          Saved on: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Unknown"}
                        </p>
                      </div>

                      <div className="d-flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="primary"
                          className="rounded-3"
                          onClick={() => navigate(`/jobs/${job.jobId}`)}
                        >
                          View Job
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          className="rounded-3"
                          onClick={() => deleteSavedJob(job._id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MySavedJobs;