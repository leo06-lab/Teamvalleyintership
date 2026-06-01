import React from "react"; // Importon React
import { Link, useNavigate, useParams } from "react-router-dom"; // Importon routing
import "../styles/JobDetails.css"; // Importon CSS-in
import { jobsData } from "../data/jobsData"; // Importon jobs data

function JobDetails() {
  const { id } = useParams(); // Merr id nga URL
  const navigate = useNavigate(); // Përdoret për redirect

  const job = jobsData.find((item) => item.id === Number(id)); // Gjen punën sipas id

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
    (item) => item.category === job.category && item.id !== job.id
  );

  const handleApply = () => {
    const user = JSON.parse(localStorage.getItem("jobvalleyUser"));

    if (!user || !user.isLoggedIn) {
      alert("Please login as candidate before applying.");
      navigate("/login");
      return;
    }

    if (user.role !== "candidate") {
      alert("Only candidates can apply for jobs.");
      return;
    }

    const oldApplications =
      JSON.parse(localStorage.getItem("jobvalleyApplications")) || [];

    const alreadyApplied = oldApplications.some(
      (application) => application.jobId === job.id
    );

    if (alreadyApplied) {
      alert("You have already applied for this job.");
      return;
    }

    const newApplication = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      candidate: user.fullName || `${user.firstName} ${user.lastName}`,
      appliedAt: new Date().toLocaleString(),
      status: "Pending",
    };

    localStorage.setItem(
      "jobvalleyApplications",
      JSON.stringify([...oldApplications, newApplication])
    );

    alert("Application submitted successfully.");
  };

  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem("jobvalleySavedJobs")) || [];

    const alreadySaved = savedJobs.some((savedJob) => savedJob.id === job.id);

    if (alreadySaved) {
      alert("This job is already saved.");
      return;
    }

    localStorage.setItem(
      "jobvalleySavedJobs",
      JSON.stringify([...savedJobs, job])
    );

    alert("Job saved successfully.");
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
          <div className="apply-card">
            <h3>{job.salary}</h3>
            <p>Estimated salary range</p>

            <button type="button" className="apply-main-btn" onClick={handleApply}>
              Apply Now
            </button>

            <button type="button" className="save-main-btn" onClick={handleSaveJob}>
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
              This company is looking for motivated candidates through JobValley.
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