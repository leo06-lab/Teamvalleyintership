import React, { useState } from "react"; // Importon React dhe useState
import { Link } from "react-router-dom"; // Importon Link për navigim
import "../styles/Jobs.css"; // Importon CSS-in e Jobs page
import { jobsData } from "../data/jobsData"; // Importon të dhënat e punëve

function Jobs() {
  const [searchText, setSearchText] = useState(""); // Mban tekstin e kërkimit
  const [locationText, setLocationText] = useState(""); // Mban lokacionin
  const [activeCategory, setActiveCategory] = useState("All"); // Mban kategorinë aktive
  const [activeType, setActiveType] = useState("All"); // Mban tipin aktiv

  const categories = ["All", ...new Set(jobsData.map((job) => job.category))]; // Merr kategoritë dinamike
  const jobTypes = ["All", ...new Set(jobsData.map((job) => job.type))]; // Merr tipet dinamike

  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase()) ||
      job.category.toLowerCase().includes(searchText.toLowerCase()) ||
      job.tags.join(" ").toLowerCase().includes(searchText.toLowerCase());

    const matchesLocation =
      locationText === "" ||
      job.location.toLowerCase().includes(locationText.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || job.category === activeCategory;

    const matchesType = activeType === "All" || job.type === activeType;

    return matchesSearch && matchesLocation && matchesCategory && matchesType;
  });

  const resetFilters = () => {
    setSearchText("");
    setLocationText("");
    setActiveCategory("All");
    setActiveType("All");
  };

  return (
    <main className="jobs-page">
      <section className="jobs-hero">
        <div className="jobs-hero-content">
          <span>Find a Job</span>
          <h1>Find the right job for your career</h1>
          <p>
            Search jobs by keyword, location, category and work type. JobValley
            helps candidates discover better opportunities faster.
          </p>
        </div>
      </section>

      <section className="jobs-search-section">
        <div className="jobs-search-box">
          <div className="jobs-input-group">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Job title, company or keyword"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="jobs-input-group">
            <span>⌖</span>
            <input
              type="text"
              placeholder="Location"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
            />
          </div>

          <button type="button">Search Jobs</button>
        </div>
      </section>

      <section className="jobs-content">
        <aside className="jobs-sidebar">
          <div className="filter-card">
            <h3>Categories</h3>

            <div className="filter-list">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={activeCategory === category ? "active-filter" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-card">
            <h3>Job Type</h3>

            <div className="filter-list">
              {jobTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  className={activeType === type ? "active-filter" : ""}
                  onClick={() => setActiveType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="reset-filter-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </aside>

        <div className="jobs-main">
          <div className="jobs-topbar">
            <div>
              <h2>Available Jobs</h2>
              <p>{filteredJobs.length} jobs found</p>
            </div>

            <select
              value={activeType}
              onChange={(e) => setActiveType(e.target.value)}
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="jobs-list-page">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <article className="job-list-card" key={job.id}>
                  <div className={`job-company-logo ${job.color}`}>
                    {job.company.charAt(0)}
                  </div>

                  <div className="job-list-info">
                    <div className="job-title-row">
                      <div>
                        <h3>{job.title}</h3>
                        <p>
                          {job.company} • {job.location}
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
                      {job.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="job-actions">
                    <button type="button" className="save-job-btn">
                      ♡
                    </button>

                    <Link to={`/jobs/${job.id}`}>View Details</Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="jobs-empty">
                <h3>No jobs found</h3>
                <p>Try changing the keyword, location or filters.</p>
                <button type="button" onClick={resetFilters}>
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Jobs;