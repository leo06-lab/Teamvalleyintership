import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

function HomeJobsForYou() {
  const API_URL = "http://localhost:5000/api/jobs";

  const [jobs, setJobs] = useState([]);
  const [allCategories, setAllCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?page=1&limit=50`);
      const result = await response.json();

      if (response.ok && result.success) {
        const categories = [
          "All",
          ...new Set(
            (result.data || [])
              .map((job) => job.category)
              .filter((category) => category && category.trim() !== "")
          ),
        ];

        setAllCategories(categories);
      }
    } catch (error) {
      console.log("Could not load categories.");
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: "1",
        limit: "6",
      });

      if (activeCategory !== "All") {
        params.append("category", activeCategory);
      }

      const response = await fetch(`${API_URL}?${params}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Could not load jobs.");
        setLoading(false);
        return;
      }

      setJobs(result.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Backend is not running.");
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <section className="home-jobs-for-you">
      <div className="home-jobs-header">
        <div>
          <span>Jobs for You</span>
          <h2>Latest Jobs From Companies</h2>
          <p>
            Explore real job opportunities posted by companies on JobValley.
          </p>
        </div>

        <Link to="/jobs">View All Jobs</Link>
      </div>

      <div className="home-category-buttons">
        {allCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={activeCategory === category ? "active-home-category" : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="home-jobs-empty">
          <h3>Loading jobs...</h3>
          <p>Please wait while jobs are loading.</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="home-jobs-empty">
          <h3>No jobs found</h3>
          <p>No jobs are available for this category right now.</p>
        </div>
      ) : (
        <div className="home-jobs-grid">
          {jobs.map((job) => {
            const companyName =
              job.companyName || job.company?.companyName || "Company";

            const companyLogo = getImageUrl(job.company?.logo || "");

            return (
              <div className="home-job-card" key={job._id}>
                <div className="home-job-top">
                  <div className="home-job-logo">
                    {companyLogo ? (
                      <img src={companyLogo} alt={`${companyName} logo`} />
                    ) : (
                      <span>{companyName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div>
                    <h3>{job.title}</h3>
                    <p>{companyName}</p>
                  </div>
                </div>

                <div className="home-job-info">
                  <span>{job.category}</span>
                  <span>{job.type}</span>
                  <span>{job.location}</span>
                </div>

                <div className="home-job-bottom">
                  <strong>{job.salary}</strong>
                  <Link to={`/jobs/${job._id}`}>View Details</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default HomeJobsForYou;