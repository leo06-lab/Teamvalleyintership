import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import homePageImage from "../assets/images/homepage.png";
import { getImageUrl } from "../utils/getImageUrl";
import InlineMessage from "../components/InlineMessage";
import { useInlineMessage } from "../hooks/useInlineMessage";
import PlatformReviews from "../components/PlatformReviews";

const JOBS_API_URL = "http://localhost:5000/api/jobs";

const fallbackCategories = [
  "Retail & Product",
  "Content Writer",
  "Human Resource",
  "Market Research",
  "Software",
  "Finance",
  "Management",
  "Marketing & Sales",
];

const cardColors = [
  "red",
  "blue",
  "yellow",
  "purple",
  "green",
  "cyan",
  "orange",
  "teal",
];

const isJobFromLastFiveDays = (job) => {
  if (!job.createdAt) {
    return false;
  }

  const jobDate = new Date(job.createdAt);
  const today = new Date();

  if (Number.isNaN(jobDate.getTime())) {
    return false;
  }

  const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
  const difference = today.getTime() - jobDate.getTime();

  return difference <= fiveDaysInMs;
};

const normalizeText = (value) => {
  return String(value || "").trim().toLowerCase();
};

function Home() {
  const navigate = useNavigate();
  const { message, showMessage } = useInlineMessage();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");

  const [categories, setCategories] = useState(fallbackCategories);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [allJobs, setAllJobs] = useState([]);
  const [jobsOfTheDay, setJobsOfTheDay] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const fetchHomeJobs = useCallback(async () => {
    try {
      setLoadingJobs(true);

      const response = await fetch(`${JOBS_API_URL}?page=1&limit=500`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not load jobs.", "error");
        setLoadingJobs(false);
        return;
      }

      const jobsData = result.data || [];

      setAllJobs(jobsData);

      const realCategories = [
        ...new Set(
          jobsData
            .map((job) => job.category)
            .filter((category) => category && category.trim() !== "")
        ),
      ];

      const counts = jobsData.reduce((acc, job) => {
        if (job.category) {
          acc[job.category] = (acc[job.category] || 0) + 1;
        }

        return acc;
      }, {});

      if (realCategories.length > 0) {
        setCategories(realCategories);
        setCategoryCounts(counts);
      }

      setLoadingJobs(false);
    } catch (error) {
      setLoadingJobs(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [showMessage]);

  useEffect(() => {
    fetchHomeJobs();
  }, [fetchHomeJobs]);

  useEffect(() => {
    const recentJobs = allJobs.filter((job) => {
      const isRecent = isJobFromLastFiveDays(job);

      if (activeCategory === "All") {
        return isRecent;
      }

      return (
        isRecent &&
        normalizeText(job.category) === normalizeText(activeCategory)
      );
    });

    setJobsOfTheDay(recentJobs);
  }, [allJobs, activeCategory]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchText.trim() !== "") {
      params.append("search", searchText.trim());
    }

    if (locationText.trim() !== "") {
      params.append("location", locationText.trim());
    }

    if (activeCategory !== "All") {
      params.append("category", activeCategory);
    }

    const queryString = params.toString();

    navigate(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  const handleBrowseCategory = (category) => {
    if (category === "All") {
      navigate("/jobs");
      return;
    }

    navigate(`/jobs?category=${encodeURIComponent(category)}`);
  };

  const handleRecentCategory = (category) => {
    setActiveCategory(category);

    const jobsSection = document.querySelector(".jobs-section");

    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResetRecentJobs = () => {
    setActiveCategory("All");
  };

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-left fade-up">
          <h1>
            The <span>Easiest Way</span>
            <br />
            to Get Your New Job
          </h1>

          <p>
            Each month, thousands of job seekers use JobValley to discover new
            opportunities and connect with companies faster.
          </p>

          <div className="hero-search">
            <div className="search-field">
              <span>▦</span>
              <input
                type="text"
                placeholder="Industry or keyword"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="search-field">
              <span>⌖</span>
              <input
                type="text"
                placeholder="Location"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
            </div>

            <div className="search-field">
              <span>⌗</span>
              <input
                type="text"
                placeholder="Category"
                value={activeCategory === "All" ? "" : activeCategory}
                onChange={(e) => setActiveCategory(e.target.value || "All")}
              />
            </div>

            <button type="button" onClick={handleSearch}>
              Search
            </button>
          </div>

          <div className="popular-searches">
            <strong>Popular Searches:</strong>

            {["Software", "Finance", "Human Resource", "Management"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleBrowseCategory(item)}
                  className="popular-btn"
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        <div className="hero-right fade-in">
          <div className="shape shape-one"></div>
          <div className="shape shape-two"></div>

          <div className="image-card image-card-main">
            <img src={homePageImage} alt="JobValley team" />
          </div>

          <div className="image-card image-card-small">
            <img src={homePageImage} alt="Job interview" />
          </div>

          <div className="dots dots-one"></div>
          <div className="dots dots-two"></div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading fade-up">
          <h2>Browse by category</h2>
          <p>
            Find the job that’s perfect for you. New opportunities are added
            every day.
          </p>
        </div>

        <div className="category-filter-row">
          <button
            type="button"
            className="filter-btn active"
            onClick={() => handleBrowseCategory("All")}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className="filter-btn"
              onClick={() => handleBrowseCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              type="button"
              className="category-card"
              key={category}
              onClick={() => handleBrowseCategory(category)}
            >
              <div className="category-icon">▰</div>

              <div>
                <h3>{category}</h3>
                <p>{categoryCounts[category] || 0} Jobs Available</p>
              </div>
            </button>
          ))}
        </div>

        <div className="slider-dots">
          <span></span>
          <span></span>
          <span className="active"></span>
        </div>
      </section>

      <section className="jobs-section">
        <div className="section-heading fade-up">
          <h2>Jobs of the day</h2>
          <p>Only jobs published during the last 5 days are shown here.</p>
        </div>

        <div className="job-tabs">
          <button
            type="button"
            className={activeCategory === "All" ? "active-tab" : ""}
            onClick={() => handleRecentCategory("All")}
          >
            All Jobs
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={activeCategory === category ? "active-tab" : ""}
              onClick={() => handleRecentCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <InlineMessage message={message} />

        <div className="results-info">
          <span>{jobsOfTheDay.length} recent jobs found</span>

          {activeCategory !== "All" && (
            <button type="button" onClick={handleResetRecentJobs}>
              Clear filter
            </button>
          )}
        </div>

        <div className="jobs-grid">
          {loadingJobs ? (
            <div className="no-results">
              <h3>Loading jobs...</h3>
              <p>Please wait while jobs are loading.</p>
            </div>
          ) : jobsOfTheDay.length > 0 ? (
            jobsOfTheDay.map((job, index) => {
              const companyName =
                job.companyName || job.company?.companyName || "Company";

              const companyLogo = getImageUrl(
                job.company?.logo || job.companyLogo || job.logo || ""
              );

              const jobColor = cardColors[index % cardColors.length];

              return (
                <div className="job-card smooth-card" key={job._id}>
                  <div
                    className={
                      companyLogo
                        ? `job-logo ${jobColor} job-logo-image`
                        : `job-logo ${jobColor}`
                    }
                  >
                    {companyLogo ? (
                      <img src={companyLogo} alt={`${companyName} logo`} />
                    ) : (
                      companyName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <h3>{companyName}</h3>
                  <h4>{job.title}</h4>

                  <div className="job-meta">
                    <span>{job.type}</span>
                    <span>{job.location}</span>
                  </div>

                  <p>
                    {job.description
                      ? job.description.length > 120
                        ? `${job.description.slice(0, 120)}...`
                        : job.description
                      : "A modern opportunity for motivated candidates who want to grow their career with a professional team."}
                  </p>

                  <div className="job-tags">
                    <span>{job.category}</span>
                    <span>{job.type}</span>
                    <span>{job.location}</span>
                  </div>

                  <div className="job-bottom">
                    <strong>{job.salary || "Negotiable"}</strong>

                    <Link to={`/jobs/${job._id}`}>Apply Now</Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <h3>No recent jobs found</h3>
              <p>
                No jobs were published in the last 5 days for this category.
              </p>

              <button type="button" onClick={handleResetRecentJobs}>
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      <PlatformReviews />
    </main>
  );
}

export default Home;