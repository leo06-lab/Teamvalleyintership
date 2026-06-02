import React from "react"; // Importon React
import { Link } from "react-router-dom"; // Importon Link për navigim

function JobCard({ job }) { // Merr një job si prop

  const handleSaveJob = () => { // Funksioni për save job
    const savedJobs = JSON.parse(localStorage.getItem("jobvalleySavedJobs")) || []; // Merr jobs të ruajtura

    const alreadySaved = savedJobs.some((savedJob) => savedJob.id === job.id); // Kontrollon nëse është ruajtur

    if (alreadySaved) { // Nëse është ruajtur më parë
      alert("This job is already saved."); // Mesazh
      return; // Ndalon funksionin
    }

    localStorage.setItem("jobvalleySavedJobs", JSON.stringify([...savedJobs, job])); // Ruan job-in
    alert("Job saved successfully."); // Mesazh suksesi
  };

  return ( // Kthen kartën e punës
    <article className="job-list-card"> {/* Karta kryesore */}

      <div className={`job-company-logo ${job.color}`}> {/* Logo e kompanisë */}
        {job.company.charAt(0)}
      </div>

      <div className="job-list-info"> {/* Informacioni kryesor */}

        <div className="job-title-row"> {/* Rreshti titull + pagë */}
          <div>
            <h3>{job.title}</h3> {/* Titulli i punës */}
            <p>{job.company} • {job.location}</p> {/* Kompania dhe lokacioni */}
          </div>

          <strong>{job.salary}</strong> {/* Paga */}
        </div>

        <div className="job-details-row"> {/* Detaje të shkurtra */}
          <span>{job.type}</span>
          <span>{job.category}</span>
          <span>{job.posted}</span>
        </div>

        <div className="job-tags-row"> {/* Tags */}
          {job.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

      </div>

      <div className="job-actions"> {/* Butonat */}
        <button type="button" className="save-job-btn" onClick={handleSaveJob}>
          ♡
        </button>

        <Link to={`/jobs/${job.id}`}>
          View Details
        </Link>
      </div>

    </article>
  );
}

export default JobCard; // Eksporton JobCard