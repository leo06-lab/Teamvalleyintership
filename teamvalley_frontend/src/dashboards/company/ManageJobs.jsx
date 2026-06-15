import React, { useCallback, useEffect, useState } from "react";

function ManageJobs({ compact }) {
  const API_URL = "http://localhost:5000/api/jobs";
  const token = localStorage.getItem("jobvalleyToken");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: compact ? 4 : 5,
    pages: 1,
  });

  const [totalJobs, setTotalJobs] = useState(0);

  const [editingJob, setEditingJob] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    type: "Full Time",
    location: "",
    salary: "",
    deadline: "",
    description: "",
    status: "active",
  });

  const fetchCompanyJobs = useCallback(async () => {
    try {
      setLoading(true);

      const limit = compact ? 4 : 5;

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (!compact && searchText.trim() !== "") {
        params.append("search", searchText.trim());
      }

      if (!compact && statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`${API_URL}/company/my-jobs?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Could not load jobs.");
        setLoading(false);
        return;
      }

      setJobs(result.data || []);
      setTotalJobs(result.total || 0);
      setPagination(
        result.pagination || {
          page: 1,
          limit,
          pages: 1,
        }
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Backend is not running.");
    }
  }, [token, page, searchText, statusFilter, compact]);

  useEffect(() => {
    fetchCompanyJobs();
  }, [fetchCompanyJobs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCompanyJobs();
  };

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter("all");
    setPage(1);
  };

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Could not delete job.");
        return;
      }

      alert("Job deleted successfully.");
      fetchCompanyJobs();
    } catch (error) {
      alert("Backend is not running.");
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "active" ? "closed" : "active";

    try {
      const response = await fetch(`${API_URL}/${job._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Could not update job status.");
        return;
      }

      fetchCompanyJobs();
    } catch (error) {
      alert("Backend is not running.");
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);

    setEditForm({
      title: job.title || "",
      category: job.category || "",
      type: job.type || "Full Time",
      location: job.location || "",
      salary: job.salary || "",
      deadline: job.deadline || "",
      description: job.description || "",
      status: job.status || "active",
    });
  };

  const closeEditModal = () => {
    setEditingJob(null);

    setEditForm({
      title: "",
      category: "",
      type: "Full Time",
      location: "",
      salary: "",
      deadline: "",
      description: "",
      status: "active",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();

    if (
      editForm.title.trim() === "" ||
      editForm.category.trim() === "" ||
      editForm.type.trim() === "" ||
      editForm.location.trim() === "" ||
      editForm.salary.trim() === "" ||
      editForm.deadline.trim() === "" ||
      editForm.description.trim() === ""
    ) {
      alert("Please fill all job fields.");
      return;
    }

    try {
      setSavingEdit(true);

      const response = await fetch(`${API_URL}/${editingJob._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Could not update job.");
        setSavingEdit(false);
        return;
      }

      setSavingEdit(false);
      closeEditModal();
      alert("Job updated successfully.");
      fetchCompanyJobs();
    } catch (error) {
      setSavingEdit(false);
      alert("Backend is not running.");
    }
  };

  return (
    <>
      <section
        className={
          compact
            ? "company-dashboard-card manage-jobs-page compact-manage-jobs"
            : "company-dashboard-card manage-jobs-page"
        }
      >
        <div className="company-card-header">
          <div>
            <h2>{compact ? "Recent Jobs" : "Manage Jobs"}</h2>
            <p>
              {compact
                ? "Latest jobs posted by your company."
                : "Search, filter, edit, close or delete jobs posted by your company."}
            </p>
          </div>

          {!compact && <span>{totalJobs} jobs</span>}
        </div>

        {!compact && (
          <form className="manage-jobs-filters" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by title, category or location..."
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>

            <button type="submit">Search</button>

            <button type="button" onClick={handleClearFilters}>
              Clear
            </button>
          </form>
        )}

        {loading ? (
          <div className="company-empty-box">
            <h3>Loading jobs...</h3>
          </div>
        ) : jobs.length === 0 ? (
          <div className="company-empty-box">
            <h3>No jobs found</h3>
            <p>Create your first job or try another filter.</p>
          </div>
        ) : (
          <div className="company-jobs-table">
            <div className="company-jobs-table-head">
              <span>Job Title</span>
              <span>Location</span>
              <span>Type</span>
              <span>Applicants</span>
              <span>Status</span>
              {!compact && <span>Actions</span>}
            </div>

            {jobs.map((job) => (
              <div className="company-jobs-table-row" key={job._id}>
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.category}</p>
                </div>

                <span>{job.location}</span>

                <span>{job.type}</span>

                <span>{job.applicants || 0}</span>

                <span
                  className={
                    job.status === "active"
                      ? "company-status active"
                      : "company-status closed"
                  }
                >
                  {job.status}
                </span>

                {!compact && (
                  <div className="company-job-actions">
                    <button
                      type="button"
                      className="company-small-btn edit"
                      onClick={() => openEditModal(job)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="company-small-btn"
                      onClick={() => handleToggleStatus(job)}
                    >
                      {job.status === "active" ? "Close" : "Activate"}
                    </button>

                    <button
                      type="button"
                      className="company-small-btn delete"
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!compact && pagination.pages > 1 && (
          <div className="company-pagination">
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

      {editingJob && (
        <div className="edit-job-modal-overlay">
          <div className="edit-job-modal">
            <div className="edit-job-modal-header">
              <div>
                <h2>Edit Job</h2>
                <p>Update job information and status.</p>
              </div>

              <button type="button" onClick={closeEditModal}>
                ×
              </button>
            </div>

            <form className="edit-job-form" onSubmit={handleUpdateJob}>
              <div className="company-profile-form-grid">
                <div className="company-form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="company-form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="company-form-group">
                  <label>Job Type *</label>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="company-form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="company-form-group">
                  <label>Salary *</label>
                  <input
                    type="text"
                    name="salary"
                    value={editForm.salary}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="company-form-group">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    value={editForm.deadline}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="company-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="company-form-group">
                <label>Job Description *</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                ></textarea>
              </div>

              <div className="edit-job-actions">
                <button
                  type="button"
                  className="company-secondary-btn"
                  onClick={closeEditModal}
                  disabled={savingEdit}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="company-primary-btn"
                  disabled={savingEdit}
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageJobs;