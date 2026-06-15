import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/JobDetails.css";
import { jobsData } from "../data/jobsData";
import axios from "axios";
import { Alert } from "react-bootstrap";

function JobDetails() {
  const { id } = useParams();
  //const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const job = jobsData.find((item) => item.id === Number(id));

  if (!job) {
    return (
      <main className="job-details-page">
        <section className="job-not-found">
          <h1>Job not found</h1>
          <p>This job does not exist or may have been removed.</p>
          <Link to="/jobs">Back to Jobs</Link>
        </section>
      </main>
    );
  }

  const similarJobs = jobsData.filter(
    (item) => item.category === job.category && item.id !== job.id,
  );

  // Funksioni per te aplikuar per nje pune
  const handleApply = async () => {
    try {
      await axios.post("http://localhost:5000/api/candidate/applications", {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
      });

      setSuccessMessage("Aplikimi u dërgua me sukses.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Gabim gjatë aplikimit për punë.",
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  // Funksioni per te ruajtur nje pune
  const handleSaveJob = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("jobvalleyUser"));

      await axios.post("http://localhost:5000/api/candidate/saved-jobs", {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        candidateEmail: user.email,
      });
      setSuccessMessage("Puna u ruajt me sukses.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Gabim gjatë ruajtjes së punës.");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <main className="job-details-page">
      <section className="job-details-hero">
        <div className="job-details-hero-content">
          <Link to="/jobs" className="back-link">
            ← Back to Jobs
          </Link>

          <div className="job-details-header">
            <div className={`details-company-logo ${job.color}`}>
              {job.company.charAt(0)}
            </div>

            <div className="details-title-box">
              <span>{job.company}</span>
              <h1>{job.title}</h1>

              <div className="details-meta">
                <p>{job.location}</p>
                <p>{job.type}</p>
                <p>{job.category}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="job-details-content">
        <div className="job-details-main">
          <div className="details-card">
            <h2>Job Description</h2>
            <p>{job.description}</p>
          </div>

          <div className="details-card">
            <h2>Responsibilities</h2>
            <ul>
              {job.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="details-card">
            <h2>Requirements</h2>
            <ul>
              {job.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="details-card">
            <h2>Benefits</h2>
            <ul>
              {job.benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="job-details-sidebar">
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <div className="apply-card">
            <h3>{job.salary}</h3>
            <p>Estimated salary range</p>

            <button
              type="button"
              className="apply-main-btn"
              onClick={handleApply}
            >
              Apply Now
            </button>

            <button
              type="button"
              className="save-main-btn"
              onClick={handleSaveJob}
            >
              Save Job
            </button>
          </div>

          <div className="overview-card">
            <h3>Job Overview</h3>

            <div className="overview-list">
              <div>
                <span>Posted</span>
                <strong>{job.posted}</strong>
              </div>

              <div>
                <span>Deadline</span>
                <strong>{job.deadline}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{job.location}</strong>
              </div>

              <div>
                <span>Job Type</span>
                <strong>{job.type}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{job.category}</strong>
              </div>

              <div>
                <span>Level</span>
                <strong>{job.level}</strong>
              </div>
            </div>
          </div>

          <div className="company-card">
            <h3>Company</h3>

            <div className="company-mini">
              <div className={`details-company-logo small ${job.color}`}>
                {job.company.charAt(0)}
              </div>

              <div>
                <h4>{job.company}</h4>
                <p>{job.category} company</p>
              </div>
            </div>

            <p>
              This company is looking for motivated candidates through
              JobValley.
            </p>
          </div>

          {similarJobs.length > 0 && (
            <div className="similar-card">
              <h3>Similar Jobs</h3>

              {similarJobs.map((similarJob) => (
                <Link
                  to={`/jobs/${similarJob.id}`}
                  className="similar-job"
                  key={similarJob.id}
                >
                  <strong>{similarJob.title}</strong>
                  <span>{similarJob.company}</span>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default JobDetails;
