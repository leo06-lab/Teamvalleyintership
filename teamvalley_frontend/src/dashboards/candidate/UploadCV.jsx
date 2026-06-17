import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import api from "../../api/axios";

function UploadCV() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
      setSuccess("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Ju lutemi zgjidhni një skedar më parë.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("cv", file);

      await api.post("/candidate/profile/cv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("CV u ngarkua me sukses.");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      setFile(null);
      setFileName("");
    } catch (err) {
      setError(err.response?.data?.message || "Gabim gjatë ngarkimit të CV-së.");
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="px-0">
      <Card className="panel-card upload-card rounded-4">
        <Card.Body>
          <div className="section-head mb-4">
            <div>
              <h3 className="mb-1">Upload CV</h3>
              <p className="text-muted mb-0">
                Upload your resume in PDF or Word format.
              </p>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Choose your CV</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </Form.Group>

            {fileName && (
              <div className="selected-file mb-3">
                Selected file: <strong>{fileName}</strong>
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload CV"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UploadCV;