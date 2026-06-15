import React, { useEffect, useMemo, useState } from "react";
import { Container, Card, Form, Button, Row, Col, Badge, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

function CandidateProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    about: "",
    skills: "",
    education: "",
    experience: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get("http://localhost:5000/api/candidate/profile");
        const data = response.data;

        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          about: data.about || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
          education: data.education || "",
          experience: data.experience || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          portfolio: data.portfolio || "",
        });
      } catch (err) {
        
        setError(err.response?.data?.message || "Gabim gjatë ngarkimit të profilit.");
        setTimeout(() => {setError("");}, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const profileCompletion = useMemo(() => {
    const fields = [
      formData.fullName,
      formData.email,
      formData.phone,
      formData.address,
      formData.about,
      formData.skills,
      formData.education,
      formData.experience,
      formData.linkedin,
      formData.github,
      formData.portfolio,
    ];

    const filled = fields.filter((value) => value && value.trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await axios.put("http://localhost:5000/api/candidate/profile", {
        ...formData,
        skills: formData.skills,
      });

      setSuccess("Profili u ruajt me sukses.");
      setTimeout(() => {setSuccess("");}, 3000);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Gabim gjatë ruajtjes së profilit.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="px-0">
        <Card className="panel-card mx-3 rounded-4">
          <Card.Body className="text-center py-5">
            <Spinner animation="border" />
            <div className="mt-3">Duke ngarkuar profilin...</div>
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
              <h3 className="mb-1">My Profile</h3>
              <p className="text-muted mb-0">
                View your profile details and edit them when needed.
              </p>
            </div>

            <Button
              variant={isEditing ? "outline-secondary" : "primary"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {!isEditing ? (
            <Row className="g-4">
              <Col lg={4}>
                <div className="profile-summary">
                  <div className="profile-avatar">
                    {formData.fullName
                      ? formData.fullName
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "?"}
                  </div>

                  <h4 className="mb-1">{formData.fullName || "No name added"}</h4>
                  <div className="text-muted mb-3">{formData.email || "No email added"}</div>

                  <Badge
                    bg={profileCompletion >= 80 ? "success" : "warning"}
                    className="rounded-pill px-3 py-2"
                  >
                    {profileCompletion}% Completed
                  </Badge>

                  <div className="profile-meta mt-4">
                    <div><strong>Phone:</strong> {formData.phone || "Not added"}</div>
                    <div><strong>Address:</strong> {formData.address || "Not added"}</div>
                    <div><strong>Education:</strong> {formData.education || "Not added"}</div>
                  </div>
                </div>
              </Col>

              <Col lg={8}>
                <div className="profile-view-box">
                  <h5>About Me</h5>
                  <p className="text-muted">{formData.about || "No description added yet."}</p>

                  <h5 className="mt-4">Skills</h5>
                  <div className="chip-group">
                    {formData.skills
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                      .map((skill, index) => (
                        <span className="skill-chip" key={index}>
                          {skill}
                        </span>
                      ))}
                  </div>

                  <h5 className="mt-4">Experience</h5>
                  <p className="text-muted">{formData.experience || "No experience added yet."}</p>

                  <Row className="g-3 mt-2">
                    <Col md={4}>
                      <div className="link-box">
                        <small className="text-muted">LinkedIn</small>
                        <div><a href={formData.linkedin} target="_blank" rel="noopener noreferrer">{formData.linkedin || "Not added"}</a></div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="link-box">
                        <small className="text-muted">GitHub</small>
                        <div><a href={formData.github} target="_blank" rel="noopener noreferrer">{formData.github || "Not added"}</a></div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="link-box">
                        <small className="text-muted">Portfolio</small>
                        <div><a href={formData.portfolio} target="_blank" rel="noopener noreferrer">{formData.portfolio || "Not added"}</a></div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" value={formData.email} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control name="address" value={formData.address} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>About Me</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Skills</Form.Label>
                <Form.Control
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, JavaScript, CSS"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Education</Form.Label>
                <Form.Control
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>GitHub</Form.Label>
                    <Form.Control
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Portfolio</Form.Label>
                    <Form.Control
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CandidateProfile;