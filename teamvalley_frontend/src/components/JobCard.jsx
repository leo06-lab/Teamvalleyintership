import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

function JobCard({ job }) {
  const companyName = job.company || "Company";
  const companyInitial = companyName.charAt(0).toUpperCase();
  const companyLogoUrl = getImageUrl(job.companyLogo);

  return (
    <div className="job-list-card">
      <div className={`job-company-logo ${job.color || "blue"}`}>
        {companyLogoUrl ? (
          <img src={companyLogoUrl} alt={`${companyName} logo`} />
        ) : (
          <span>{companyInitial}</span>
        )}
      </div>

      <div className="job-list-info">
        <div className="job-title-row">
          <div>
            <h3>{job.title}</h3>
            <p>
              {companyName} • {job.location}
            </p>
          </div>

          <strong>{job.salary}</strong>
        </div>

        <div className="job-details-row">
          <span>{job.type}</span>
          <span>{job.category}</span>
          <span>{job.posted}</span>
        </div>

        <div className="job-tags-row">
          {job.tags?.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="job-actions">
        <button type="button" className="save-job-btn">
          ♡
        </button>

        <Link to={`/jobs/${job.id}`}>View Details</Link>
      </div>
    </div>
  );
}

export default JobCard;