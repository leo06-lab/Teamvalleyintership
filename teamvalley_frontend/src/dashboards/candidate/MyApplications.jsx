import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Table,
  Badge,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import api from "../../api/axios";

function MyApplications() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications/my-applications");
      setApplications(response.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gabim gjatë ngarkimit të aplikimeve.",
      );
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getVariant = (status) => {
    if (status === "pending") return "warning";
    if (status === "interview") return "primary";
    if (status === "accepted") return "success";
    if (status === "rejected") return "danger";
    return "secondary";
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleViewJob = (id) => {
    navigate(`/jobs/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/applications/${id}`);

      setApplications((currentApplications) =>
        currentApplications.filter((app) => app._id !== id)
      );

      setSuccess("Aplikimi u anullua me sukses.");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Gabim gjatë anulimit të aplikimit."
      );
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const jobTitle = app.jobTitle || "";
      const company = app.companyName || app.company?.companyName || "";

      const matchesSearch =
        jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  if (loading) {
    return (
      <Container fluid className="px-0">
        <Card className="panel-card mx-3 rounded-4">
          <Card.Body className="text-center py-5">
            <Spinner animation="border" />
            <div className="mt-3">Duke ngarkuar aplikimet...</div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="px-0">
      <Card className="panel-card mx-3 rounded-4">
        <Card.Body>
          <div className="section-head mb-4">
            <div>
              <h3 className="mb-1">My Applications</h3>
              <p className="text-muted mb-0">
                Track all jobs you have applied for.
              </p>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Row className="g-3 mb-4">
            <Col md={8}>
              <Form.Control
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Col>
          </Row>

          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app._id}>
                    <td className="fw-semibold">{app.jobTitle}</td>
                    <td>{app.companyName || app.company?.companyName || "-"}</td>
                    <td>{app.job?.location || "-"}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={getVariant(app.status)}>{formatStatus(app.status)}</Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        className="me-2"
                        onClick={() => handleViewJob(app.job?._id || app.job)}
                      >
                        View Job
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(app._id)}
                      >
                        Cancel Application
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MyApplications;
