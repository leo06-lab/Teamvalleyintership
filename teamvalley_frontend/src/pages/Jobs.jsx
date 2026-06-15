import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard";
import InlineMessage from "../components/InlineMessage";
import { useInlineMessage } from "../hooks/useInlineMessage";
import "../styles/Jobs.css";

const JOBS_API_URL = "http://localhost:5000/api/jobs";

const normalizeText = (value) => {
  return String(value || "").trim().toLowerCase();
};

const mapJobForCard = (job) => {
  return {
    id: job._id,
    title: job.title || "",
    company: job.companyName || job.company?.companyName || "Company Account",
    companyLogo: job.company?.logo || "",
    location: job.location || "Not specified",
    salary: job.salary || "Not specified",
    type: job.type || "Full Time",
    category: job.category || "General",
    posted: job.createdAt
      ? new Date(job.createdAt).toLocaleDateString()
      : "Recently",
    color: "blue",
    tags: [job.category, job.type, job.location].filter(Boolean),
    description: job.description || "",
    deadline: job.deadline || "",
  };
};

const applyExactFilters = (
  jobsData,
  activeCategory,
  activeType,
  appliedSearch,
  appliedLocation
) => {
  let filteredData = [...jobsData];

  if (activeCategory !== "All") {
    filteredData = filteredData.filter(
      (job) => normalizeText(job.category) === normalizeText(activeCategory)
    );
  }

  if (activeType !== "All") {
    filteredData = filteredData.filter(
      (job) => normalizeText(job.type) === normalizeText(activeType)
    );
  }

  if (appliedSearch.trim() !== "") {
    const search = normalizeText(appliedSearch);

    filteredData = filteredData.filter((job) => {
      const title = normalizeText(job.title);
      const companyName = normalizeText(
        job.companyName || job.company?.companyName
      );
      const category = normalizeText(job.category);

      return (
        title.includes(search) ||
        companyName.includes(search) ||
        category.includes(search)
      );
    });
  }

  if (appliedLocation.trim() !== "") {
    const location = normalizeText(appliedLocation);

    filteredData = filteredData.filter((job) =>
      normalizeText(job.location).includes(location)
    );
  }

  return filteredData;
};

function Jobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { message, showMessage } = useInlineMessage();

  const [jobs, setJobs] = useState([]);
  const [allCategories, setAllCategories] = useState(["All"]);
  const [allTypes, setAllTypes] = useState(["All"]);

  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    pages: 1,
  });

  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "All";
    const searchFromUrl = searchParams.get("search") || "";
    const locationFromUrl = searchParams.get("location") || "";

    setActiveCategory(categoryFromUrl);
    setSearchText(searchFromUrl);
    setAppliedSearch(searchFromUrl);
    setLocationText(locationFromUrl);
    setAppliedLocation(locationFromUrl);
    setActiveType("All");
    setPage(1);
  }, [searchParams]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await fetch(`${JOBS_API_URL}?page=1&limit=500`);
      const result = await response.json();

      if (response.ok && result.success) {
        const jobsData = result.data || [];

        const categories = [
          "All",
          ...new Set(
            jobsData
              .map((job) => job.category)
              .filter((category) => category && category.trim() !== "")
          ),
        ];

        const types = [
          "All",
          ...new Set(
            jobsData
              .map((job) => job.type)
              .filter((type) => type && type.trim() !== "")
          ),
        ];

        setAllCategories(categories);
        setAllTypes(types);
      }
    } catch (error) {
      console.log("Could not load filter options.");
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const hasActiveFilter =
        activeCategory !== "All" ||
        activeType !== "All" ||
        appliedSearch.trim() !== "" ||
        appliedLocation.trim() !== "";

      const params = new URLSearchParams({
        page: hasActiveFilter ? "1" : String(page),
        limit: hasActiveFilter ? "500" : "6",
      });

      const response = await fetch(`${JOBS_API_URL}?${params.toString()}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not load jobs.", "error");
        setLoading(false);
        return;
      }

      const backendJobs = result.data || [];

      const exactFilteredJobs = applyExactFilters(
        backendJobs,
        activeCategory,
        activeType,
        appliedSearch,
        appliedLocation
      );

      const startIndex = hasActiveFilter ? (page - 1) * 6 : 0;
      const endIndex = hasActiveFilter ? startIndex + 6 : 6;

      const jobsForCurrentPage = hasActiveFilter
        ? exactFilteredJobs.slice(startIndex, endIndex)
        : exactFilteredJobs;

      setJobs(jobsForCurrentPage.map(mapJobForCard));
      setTotalJobs(hasActiveFilter ? exactFilteredJobs.length : result.total || 0);

      setPagination({
        page,
        limit: 6,
        pages: hasActiveFilter
          ? Math.max(Math.ceil(exactFilteredJobs.length / 6), 1)
          : result.pagination?.pages || 1,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [
    page,
    activeCategory,
    activeType,
    appliedSearch,
    appliedLocation,
    showMessage,
  ]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();

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

    setPage(1);
    setAppliedSearch(searchText);
    setAppliedLocation(locationText);

    const queryString = params.toString();
    navigate(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    setActiveType("All");
    setPage(1);

    const params = new URLSearchParams();

    if (category !== "All") {
      params.append("category", category);
    }

    if (appliedSearch.trim() !== "") {
      params.append("search", appliedSearch.trim());
    }

    if (appliedLocation.trim() !== "") {
      params.append("location", appliedLocation.trim());
    }

    const queryString = params.toString();
    navigate(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  const handleTypeFilter = (type) => {
    setActiveType(type);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setLocationText("");
    setAppliedSearch("");
    setAppliedLocation("");
    setActiveCategory("All");
    setActiveType("All");
    setPage(1);

    navigate("/jobs");
  };

  return (
    <main className="jobs-page">
      <section className="jobs-hero">
        <div className="jobs-hero-content">
          <span>Find a Job</span>
          <h1>Find Your Next Opportunity</h1>
          <p>
            Explore real job opportunities posted by companies and apply for the
            position that fits your profile.
          </p>
        </div>

        <div className="jobs-hero-shape"></div>
      </section>

      <section className="jobs-search-section">
        <form className="jobs-search-box" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Job title, company or category"
          />

          <input
            type="text"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="Location"
          />

          <button type="submit">Search</button>

          <button
            type="button"
            className="jobs-clear-btn"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </form>
      </section>

      <section className="jobs-content">
        <aside className="jobs-filters">
          <div className="filter-box">
            <h3>Category</h3>

            <div className="filter-buttons">
              {allCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? "active-filter" : ""}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-box">
            <h3>Job Type</h3>

            <div className="filter-buttons">
              {allTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={activeType === type ? "active-filter" : ""}
                  onClick={() => handleTypeFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="jobs-list-section">
          <div className="jobs-list-header">
            <div>
              <span>Available Jobs</span>
              <h2>
                {activeCategory === "All"
                  ? "Recommended Jobs"
                  : `${activeCategory} Jobs`}
              </h2>
            </div>

            <p>{totalJobs} jobs found</p>
          </div>

          <InlineMessage message={message} />

          {loading ? (
            <div className="no-jobs-box">
              <h3>Loading jobs...</h3>
              <p>Please wait while jobs are loading.</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="no-jobs-box">
              <h3>No jobs found</h3>
              <p>Try another search, category or filter.</p>
            </div>
          ) : (
            <div className="jobs-list">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="jobs-pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prevPage) => prevPage - 1)}
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => setPage((prevPage) => prevPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Jobs;