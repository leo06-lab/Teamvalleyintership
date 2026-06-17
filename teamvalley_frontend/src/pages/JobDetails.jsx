import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/JobDetails.css";
import { getImageUrl } from "../utils/getImageUrl";
import InlineMessage from "../components/InlineMessage";
import { useInlineMessage } from "../hooks/useInlineMessage";
import api from "../api/axios";

const JOBS_API_URL = "http://localhost:5000/api/jobs";
const APPLICATIONS_API_URL = "http://localhost:5000/api/applications";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jobvalleyToken");
  const loggedUser = JSON.parse(localStorage.getItem("jobvalleyUser"));

  const { message, showMessage } = useInlineMessage();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${JOBS_API_URL}/${id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          setJob(null);
          setLoading(false);
          return;
        }

        setJob(result.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setJob(null);
        showMessage("Backend is not running. Please try again.", "error");
      }
    };

    fetchJobDetails();
  }, [id, showMessage]);

  const handleApply = async () => {
    if (!token || !loggedUser) {
      showMessage("Please login first to apply for this job.", "warning");
      navigate("/login");
      return;
    }

    if (loggedUser.role !== "candidate") {
      showMessage("Only candidates can apply for jobs.", "warning");
      return;
    }

    try {
      setApplying(true);

      const response = await fetch(`${APPLICATIONS_API_URL}/apply/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coverLetter: "I am interested in this position.",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not apply for this job.", "error");
        setApplying(false);
        return;
      }

      setApplying(false);
      showMessage("Application submitted successfully.", "success");
    } catch (error) {
      setApplying(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  const handleSaveJob = async () => {
    if (!token || !loggedUser) {
      showMessage("Please login first to save this job.", "warning");
      navigate("/login");
      return;
    }

    if (loggedUser.role !== "candidate") {
      showMessage("Only candidates can save jobs.", "warning");
      return;
    }

    try {
      setSavingJob(true);

      const response = await api.post(`/candidate/saved-jobs/${id}`);
      const result = response.data;

      if (!result.success) {
        showMessage(result.message || "Could not save job.", "error");
        setSavingJob(false);
        return;
      }

      setSavingJob(false);
      showMessage("Job saved successfully.", "success");
    } catch (error) {
      setSavingJob(false);
      showMessage(
        error.response?.data?.message || "Could not save job.",
        "error"
      );
    }
  };

  const renderDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getPostedTime = (date) => {
    if (!date) {
      return "Recently";
    }

    const createdDate = new Date(date);

    if (Number.isNaN(createdDate.getTime())) {
      return "Recently";
    }

    const today = new Date();
    const difference = today.getTime() - createdDate.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return "Today";
    }

    if (days === 1) {
      return "1 day ago";
    }

    return `${days} days ago`;
  };

  const getListFromValue = (value, fallbackItems) => {
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return fallbackItems;
  };

  if (loading) {
    return (
      <main className="job-details-modern-page">
        <section className="job-details-empty">
          <h1>Loading job details...</h1>
          <p>Please wait while we load this job.</p>
        </section>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="job-details-modern-page">
        <section className="job-details-empty">
          <h1>Job Not Found</h1>
          <p>This job does not exist or it may have been removed.</p>
          <button type="button" onClick={() => navigate("/jobs")}>
            Back to Jobs
          </button>
        </section>
      </main>
    );
  }

  const company = job.company || {};
  const companyName = job.companyName || company.companyName || "Company Account";
  const companyLogo = getImageUrl(company.logo || job.companyLogo || job.logo || "");
  const companyInitial = companyName.charAt(0).toUpperCase();

  const responsibilities = getListFromValue(job.responsibilities, [
    "Build responsive pages using modern technologies",
    "Work with reusable components",
    "Connect frontend with backend APIs",
    "Fix bugs and improve performance",
  ]);

  const requirements = getListFromValue(job.requirements, [
    `Good knowledge of ${job.category || "the required field"}`,
    "Basic knowledge of modern development tools",
    "Understanding of teamwork and communication",
    "Ability to work in a professional environment",
  ]);

  const benefits = getListFromValue(job.benefits, [
    "Modern work environment",
    "Career growth opportunities",
    "Flexible working schedule",
    "Training and mentorship",
  ]);

  return (
    <main className="job-details-modern-page">
      <section className="job-details-modern-hero">
        <div className="job-details-modern-hero-inner">
          <Link to="/jobs" className="modern-back-link">
            ← Back to Jobs
          </Link>

          <div className="modern-job-hero-content">
            <div className="modern-job-logo">
              {companyLogo ? (
                <img src={companyLogo} alt={`${companyName} logo`} />
              ) : (
                <span>{companyInitial}</span>
              )}
            </div>

            <div>
              <span className="modern-company-name">{companyName}</span>
              <h1>{job.title}</h1>

              <div className="modern-job-tags">
                <span>{job.location || "Location"}</span>
                <span>{job.type || "Full Time"}</span>
                <span>{job.category || "Category"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modern-hero-circle"></div>
      </section>

      <section className="job-details-modern-container">
        <div className="job-details-main-column">
          <InlineMessage message={message} />

          <div className="modern-detail-card">
            <h2>Job Description</h2>
            <p>
              {job.description ||
                "This company is looking for motivated candidates to join their team and grow professionally."}
            </p>
          </div>

          <div className="modern-detail-card">
            <h2>Responsibilities</h2>
            <ul className="modern-check-list">
              {responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="modern-detail-card">
            <h2>Requirements</h2>
            <ul className="modern-check-list">
              {requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="modern-detail-card">
            <h2>Benefits</h2>
            <ul className="modern-check-list">
              {benefits.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="job-details-sidebar-column">
          <div className="modern-sidebar-card salary-card">
            <h2>{job.salary || "Negotiable"}</h2>
            <p>Estimated salary range</p>

            <button type="button" onClick={handleApply} disabled={applying}>
              {applying ? "Applying..." : "Apply Now"}
            </button>

            <button type="button" className="save-job-btn" onClick={handleSaveJob} disabled={savingJob}>
              {savingJob ? "Saving..." : "Save Job"}
            </button>
          </div>

          <div className="modern-sidebar-card">
            <h3>Job Overview</h3>

            <div className="modern-overview-list">
              <div>
                <span>Posted</span>
                <strong>{getPostedTime(job.createdAt)}</strong>
              </div>
              <div>
                <span>Deadline</span>
                <strong>{renderDate(job.deadline)}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{job.location || "Not specified"}</strong>
              </div>
              <div>
                <span>Job Type</span>
                <strong>{job.type || "Not specified"}</strong>
              </div>
              <div>
                <span>Category</span>
                <strong>{job.category || "Not specified"}</strong>
              </div>
              <div>
                <span>Level</span>
                <strong>{job.level || "Junior / Mid"}</strong>
              </div>
            </div>
          </div>

          <div className="modern-sidebar-card">
            <h3>Company</h3>

            <div className="modern-company-box">
              <div className="modern-company-logo-small">
                {companyLogo ? (
                  <img src={companyLogo} alt={`${companyName} logo`} />
                ) : (
                  <span>{companyInitial}</span>
                )}
              </div>

              <div>
                <h4>{companyName}</h4>
                <p>{company.industry || `${job.category || "Business"} company`}</p>
              </div>
            </div>

            <p className="modern-company-description">
              {company.description ||
                "This company is looking for motivated candidates through JobValley."}
            </p>
          </div>

          <div className="modern-sidebar-card">
            <h3>Similar Jobs</h3>
            <div className="modern-similar-job">
              <strong>{job.category || "Backend"} Developer</strong>
              <span>{companyName}</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default JobDetails;
