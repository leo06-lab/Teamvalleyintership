import React, { useCallback, useEffect, useState } from "react";
import "../../styles/AdminDashboard.css";
import InlineMessage from "../../components/InlineMessage";
import { useInlineMessage } from "../../hooks/useInlineMessage";
import { getImageUrl } from "../../utils/getImageUrl";

const ADMIN_API_URL = "http://localhost:5000/api/admin";

function AdminDashboard() {
  const token = localStorage.getItem("jobvalleyToken");
  const loggedUser = JSON.parse(localStorage.getItem("jobvalleyUser"));

  const { message, showMessage } = useInlineMessage();

  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: "",
    id: "",
    title: "",
    text: "",
    loading: false,
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalCompanies: 0,
    totalAdmins: 0,
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    interviewApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    totalReviews: 0,
    averageRating: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");

  const [applicationSearch, setApplicationSearch] = useState("");
  const [applicationStatusFilter, setApplicationStatusFilter] = useState("all");

  const adminName =
    loggedUser?.firstName || loggedUser?.companyName || "Admin";

  const maxApplicationStatus = Math.max(
    stats.pendingApplications,
    stats.shortlistedApplications,
    stats.interviewApplications,
    stats.acceptedApplications,
    stats.rejectedApplications,
    1
  );

  const getBarHeight = (value) => {
    return `${Math.max((value / maxApplicationStatus) * 100, 8)}%`;
  };

  const getAuthHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${ADMIN_API_URL}/dashboard`, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(
          result.message || "Could not load admin dashboard.",
          "error"
        );
        setLoading(false);
        return;
      }

      setStats(result.data.stats || {});
      setRecentUsers(result.data.recentUsers || []);
      setRecentJobs(result.data.recentJobs || []);
      setRecentApplications(result.data.recentApplications || []);
      setRecentReviews(result.data.recentReviews || []);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [getAuthHeaders, showMessage]);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (userRoleFilter !== "all") {
        params.append("role", userRoleFilter);
      }

      if (userSearch.trim() !== "") {
        params.append("search", userSearch.trim());
      }

      const response = await fetch(`${ADMIN_API_URL}/users?${params}`, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not load users.", "error");
        return;
      }

      setUsers(result.data || []);
    } catch (error) {
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [getAuthHeaders, userRoleFilter, userSearch, showMessage]);

  const fetchJobs = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (jobStatusFilter !== "all") {
        params.append("status", jobStatusFilter);
      }

      if (jobSearch.trim() !== "") {
        params.append("search", jobSearch.trim());
      }

      const response = await fetch(`${ADMIN_API_URL}/jobs?${params}`, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not load jobs.", "error");
        return;
      }

      setJobs(result.data || []);
    } catch (error) {
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [getAuthHeaders, jobStatusFilter, jobSearch, showMessage]);

  const fetchApplications = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (applicationStatusFilter !== "all") {
        params.append("status", applicationStatusFilter);
      }

      if (applicationSearch.trim() !== "") {
        params.append("search", applicationSearch.trim());
      }

      const response = await fetch(`${ADMIN_API_URL}/applications?${params}`, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not load applications.", "error");
        return;
      }

      setApplications(result.data || []);
    } catch (error) {
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [
    getAuthHeaders,
    applicationStatusFilter,
    applicationSearch,
    showMessage,
  ]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/reviews`, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not load reviews.", "error");
        return;
      }

      setReviews(result.data || []);
    } catch (error) {
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [getAuthHeaders, showMessage]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (activePage === "users") {
      fetchUsers();
    }

    if (activePage === "jobs") {
      fetchJobs();
    }

    if (activePage === "applications") {
      fetchApplications();
    }

    if (activePage === "reviews") {
      fetchReviews();
    }
  }, [activePage, fetchUsers, fetchJobs, fetchApplications, fetchReviews]);

  const renderDate = (date) => {
    if (!date) {
      return "No date";
    }

    return new Date(date).toLocaleDateString();
  };

  const openDeleteModal = (type, id, title, text) => {
    setDeleteModal({
      open: true,
      type,
      id,
      title,
      text,
      loading: false,
    });
  };

  const closeDeleteModal = () => {
    if (deleteModal.loading) {
      return;
    }

    setDeleteModal({
      open: false,
      type: "",
      id: "",
      title: "",
      text: "",
      loading: false,
    });
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({
        ...prev,
        loading: true,
      }));

      let endpoint = "";
      let successMessage = "";

      if (deleteModal.type === "user") {
        endpoint = `${ADMIN_API_URL}/users/${deleteModal.id}`;
        successMessage = "User deleted successfully.";
      }

      if (deleteModal.type === "job") {
        endpoint = `${ADMIN_API_URL}/jobs/${deleteModal.id}`;
        successMessage = "Job deleted successfully.";
      }

      if (deleteModal.type === "review") {
        endpoint = `${ADMIN_API_URL}/reviews/${deleteModal.id}`;
        successMessage = "Review deleted successfully.";
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not delete item.", "error");

        setDeleteModal((prev) => ({
          ...prev,
          loading: false,
        }));

        return;
      }

      setDeleteModal({
        open: false,
        type: "",
        id: "",
        title: "",
        text: "",
        loading: false,
      });

      showMessage(successMessage, "success");

      if (deleteModal.type === "user") {
        fetchUsers();
      }

      if (deleteModal.type === "job") {
        fetchJobs();
      }

      if (deleteModal.type === "review") {
        fetchReviews();
      }

      fetchDashboard();
    } catch (error) {
      setDeleteModal((prev) => ({
        ...prev,
        loading: false,
      }));

      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  const handleUpdateJobStatus = async (jobId, status) => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/jobs/${jobId}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not update job status.", "error");
        return;
      }

      showMessage("Job status updated successfully.", "success");
      fetchJobs();
      fetchDashboard();
    } catch (error) {
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await fetch(
        `${ADMIN_API_URL}/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(
          result.message || "Could not update application status.",
          "error"
        );
        return;
      }

      showMessage("Application status updated successfully.", "success");
      fetchApplications();
      fetchDashboard();
    } catch (error) {
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  return (
    <main className="company-dashboard-layout admin-company-dashboard">
      {deleteModal.open && (
        <div className="admin-delete-modal-overlay">
          <div className="admin-delete-modal">
            <div className="admin-delete-icon">!</div>

            <h2>{deleteModal.title}</h2>
            <p>{deleteModal.text}</p>

            <div className="admin-delete-actions">
              <button
                type="button"
                className="admin-cancel-delete-btn"
                onClick={closeDeleteModal}
                disabled={deleteModal.loading}
              >
                No
              </button>

              <button
                type="button"
                className="admin-confirm-delete-btn"
                onClick={confirmDelete}
                disabled={deleteModal.loading}
              >
                {deleteModal.loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="company-sidebar">
        <div className="company-sidebar-logo">
          <span>JV</span>
          <h2>JobValley</h2>
        </div>

        <nav className="company-sidebar-menu">
          <button
            type="button"
            className={activePage === "dashboard" ? "active-company-menu" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          <button
            type="button"
            className={activePage === "users" ? "active-company-menu" : ""}
            onClick={() => setActivePage("users")}
          >
            Users
          </button>

          <button
            type="button"
            className={activePage === "jobs" ? "active-company-menu" : ""}
            onClick={() => setActivePage("jobs")}
          >
            Jobs
          </button>

          <button
            type="button"
            className={
              activePage === "applications" ? "active-company-menu" : ""
            }
            onClick={() => setActivePage("applications")}
          >
            Applications
          </button>

          <button
            type="button"
            className={activePage === "reviews" ? "active-company-menu" : ""}
            onClick={() => setActivePage("reviews")}
          >
            Reviews
          </button>
        </nav>
      </aside>

      <section className="company-dashboard-main">
        <header className="company-dashboard-topbar">
          <div>
            <h1>
              {activePage === "dashboard" && "Dashboard"}
              {activePage === "users" && "Manage Users"}
              {activePage === "jobs" && "Manage Jobs"}
              {activePage === "applications" && "Applications"}
              {activePage === "reviews" && "Reviews"}
            </h1>

            <p>Welcome back, {adminName}</p>
          </div>

          <div className="company-topbar-profile">
            <div className="company-avatar">
              <span>{adminName.charAt(0).toUpperCase()}</span>
            </div>

            <div>
              <h3>{adminName}</h3>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <InlineMessage message={message} />

        {activePage === "dashboard" && (
          <div className="company-dashboard-home">
            {loading && (
              <div className="company-empty-box">
                <h3>Loading dashboard data.</h3>
                <p>Please wait while we load admin statistics.</p>
              </div>
            )}

            <section className="company-stats-grid">
              <div className="company-stat-card green">
                <p>Total Users</p>
                <h2>{stats.totalUsers}</h2>
                <span>{stats.totalCandidates} candidates</span>
              </div>

              <div className="company-stat-card">
                <p>Companies</p>
                <h2>{stats.totalCompanies}</h2>
                <span>Registered companies</span>
              </div>

              <div className="company-stat-card">
                <p>Total Jobs</p>
                <h2>{stats.totalJobs}</h2>
                <span>{stats.activeJobs} active jobs</span>
              </div>

              <div className="company-stat-card">
                <p>Reviews</p>
                <h2>{stats.totalReviews}</h2>
                <span>{stats.averageRating}/5 rating</span>
              </div>
            </section>

            <section className="company-stats-grid company-job-stats-grid">
              <div className="company-stat-card">
                <p>Total Applications</p>
                <h2>{stats.totalApplications}</h2>
                <span>All applications</span>
              </div>

              <div className="company-stat-card">
                <p>Pending</p>
                <h2>{stats.pendingApplications}</h2>
                <span>Waiting review</span>
              </div>

              <div className="company-stat-card">
                <p>Accepted</p>
                <h2>{stats.acceptedApplications}</h2>
                <span>Successful applications</span>
              </div>

              <div className="company-stat-card">
                <p>Rejected</p>
                <h2>{stats.rejectedApplications}</h2>
                <span>Rejected applications</span>
              </div>
            </section>

            <section className="company-dashboard-grid">
              <div className="company-dashboard-card wide-card">
                <div className="company-card-header">
                  <h2>Applications by Status</h2>
                  <span>MongoDB</span>
                </div>

                <div className="company-real-bar-chart">
                  <div className="company-real-bar-item">
                    <div className="company-real-bar-track">
                      <div
                        className="company-real-bar-fill"
                        style={{ height: getBarHeight(stats.pendingApplications) }}
                      ></div>
                    </div>
                    <span>Pending</span>
                    <strong>{stats.pendingApplications}</strong>
                  </div>

                  <div className="company-real-bar-item">
                    <div className="company-real-bar-track">
                      <div
                        className="company-real-bar-fill"
                        style={{
                          height: getBarHeight(stats.shortlistedApplications),
                        }}
                      ></div>
                    </div>
                    <span>Shortlisted</span>
                    <strong>{stats.shortlistedApplications}</strong>
                  </div>

                  <div className="company-real-bar-item">
                    <div className="company-real-bar-track">
                      <div
                        className="company-real-bar-fill"
                        style={{
                          height: getBarHeight(stats.interviewApplications),
                        }}
                      ></div>
                    </div>
                    <span>Interview</span>
                    <strong>{stats.interviewApplications}</strong>
                  </div>

                  <div className="company-real-bar-item">
                    <div className="company-real-bar-track">
                      <div
                        className="company-real-bar-fill"
                        style={{ height: getBarHeight(stats.acceptedApplications) }}
                      ></div>
                    </div>
                    <span>Accepted</span>
                    <strong>{stats.acceptedApplications}</strong>
                  </div>

                  <div className="company-real-bar-item">
                    <div className="company-real-bar-track">
                      <div
                        className="company-real-bar-fill"
                        style={{ height: getBarHeight(stats.rejectedApplications) }}
                      ></div>
                    </div>
                    <span>Rejected</span>
                    <strong>{stats.rejectedApplications}</strong>
                  </div>
                </div>
              </div>

              <div className="company-dashboard-card">
                <div className="company-card-header">
                  <h2>Users Overview</h2>
                  <span>Live</span>
                </div>

                <div className="company-department-list">
                  <p>
                    <span></span> Candidates <strong>{stats.totalCandidates}</strong>
                  </p>

                  <p>
                    <span></span> Companies <strong>{stats.totalCompanies}</strong>
                  </p>

                  <p>
                    <span></span> Admins <strong>{stats.totalAdmins}</strong>
                  </p>

                  <p>
                    <span></span> Total Users <strong>{stats.totalUsers}</strong>
                  </p>
                </div>
              </div>

              <div className="company-dashboard-card resources-card">
                <h2>Platform Reviews</h2>

                <div className="resources-circle">
                  <h3>{stats.averageRating}</h3>
                  <p>Average Rating</p>
                </div>

                <div className="resources-list">
                  <p>
                    <strong>{stats.totalReviews}</strong> Reviews
                  </p>

                  <p>
                    <strong>{stats.totalJobs}</strong> Jobs
                  </p>

                  <p>
                    <strong>{stats.totalApplications}</strong> Applications
                  </p>
                </div>
              </div>
            </section>

            <section className="company-bottom-grid">
              <div className="company-dashboard-card">
                <div className="company-card-header">
                  <h2>Recent Users</h2>
                  <span>{recentUsers.length}</span>
                </div>

                {recentUsers.length === 0 ? (
                  <div className="company-empty-small">
                    <p>No users yet.</p>
                  </div>
                ) : (
                  <div className="recent-applications-list">
                    {recentUsers.map((user) => {
                      const userName =
                        user.companyName ||
                        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                        "User";

                      return (
                        <div className="recent-application-item" key={user._id}>
                          <div>
                            <h3>{userName}</h3>
                            <p>{user.email}</p>
                          </div>

                          <span className={`mini-status ${user.role}`}>
                            {user.role}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="company-dashboard-card recent-applications-card">
                <div className="company-card-header">
                  <h2>Recent Jobs</h2>
                  <span>{recentJobs.length}</span>
                </div>

                {recentJobs.length === 0 ? (
                  <div className="company-empty-small">
                    <p>No jobs yet.</p>
                  </div>
                ) : (
                  <div className="recent-applications-list">
                    {recentJobs.map((job) => (
                      <div className="recent-application-item" key={job._id}>
                        <div>
                          <h3>{job.title}</h3>
                          <p>{job.companyName}</p>
                        </div>

                        <span className={`mini-status ${job.status}`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="company-dashboard-card">
                <div className="company-card-header">
                  <h2>Next Actions</h2>
                  <span>Recommended</span>
                </div>

                <div className="company-task-list">
                  <p>
                    <span>{stats.pendingApplications}</span> Review pending
                    applications
                  </p>

                  <p>
                    <span>{stats.activeJobs}</span> Check active jobs
                  </p>

                  <p>
                    <span>{stats.totalUsers}</span> Manage platform users
                  </p>

                  <p>
                    <span>{stats.totalReviews}</span> Moderate reviews
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activePage === "users" && (
          <section className="company-dashboard-card admin-page-card">
            <div className="company-card-header">
              <div>
                <h2>Users</h2>
                <p>Manage candidates, companies and admins.</p>
              </div>

              <span>{users.length} users</span>
            </div>

            <div className="admin-filters">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user..."
              />

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="candidate">Candidate</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </select>

              <button type="button" onClick={fetchUsers}>
                Search
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const userName =
                      user.companyName ||
                      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      "User";

                    return (
                      <tr key={user._id}>
                        <td>
                          <strong>{userName}</strong>
                          <small>{user.nipt || user.phone || "No extra info"}</small>
                        </td>

                        <td>{user.email}</td>

                        <td>
                          <span className={`mini-status ${user.role}`}>
                            {user.role}
                          </span>
                        </td>

                        <td>{renderDate(user.createdAt)}</td>

                        <td>
                          <button
                            type="button"
                            className="admin-danger-btn"
                            onClick={() =>
                              openDeleteModal(
                                "user",
                                user._id,
                                "Delete User",
                                `Are you sure you want to delete ${userName}?`
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "jobs" && (
          <section className="company-dashboard-card admin-page-card">
            <div className="company-card-header">
              <div>
                <h2>Jobs</h2>
                <p>Manage all jobs posted by companies.</p>
              </div>

              <span>{jobs.length} jobs</span>
            </div>

            <div className="admin-filters">
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Search job..."
              />

              <select
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>

              <button type="button" onClick={fetchJobs}>
                Search
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => {
                    const logo = getImageUrl(job.company?.logo || "");

                    return (
                      <tr key={job._id}>
                        <td>
                          <strong>{job.title}</strong>
                          <small>{job.category}</small>
                        </td>

                        <td>
                          <div className="admin-company-cell">
                            <span>
                              {logo ? (
                                <img src={logo} alt="Company logo" />
                              ) : (
                                (job.companyName || "C").charAt(0).toUpperCase()
                              )}
                            </span>

                            <div>
                              <strong>{job.companyName}</strong>
                              <small>{job.location}</small>
                            </div>
                          </div>
                        </td>

                        <td>{job.type}</td>

                        <td>
                          <select
                            className={`admin-select-status ${job.status}`}
                            value={job.status}
                            onChange={(e) =>
                              handleUpdateJobStatus(job._id, e.target.value)
                            }
                          >
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>

                        <td>{renderDate(job.createdAt)}</td>

                        <td>
                          <button
                            type="button"
                            className="admin-danger-btn"
                            onClick={() =>
                              openDeleteModal(
                                "job",
                                job._id,
                                "Delete Job",
                                `Are you sure you want to delete "${job.title}" and its related applications?`
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan="6">No jobs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "applications" && (
          <section className="company-dashboard-card admin-page-card">
            <div className="company-card-header">
              <div>
                <h2>Applications</h2>
                <p>Manage all candidate applications.</p>
              </div>

              <span>{applications.length} applications</span>
            </div>

            <div className="admin-filters">
              <input
                type="text"
                value={applicationSearch}
                onChange={(e) => setApplicationSearch(e.target.value)}
                placeholder="Search application..."
              />

              <select
                value={applicationStatusFilter}
                onChange={(e) => setApplicationStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>

              <button type="button" onClick={fetchApplications}>
                Search
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => (
                    <tr key={application._id}>
                      <td>
                        <strong>{application.candidateName}</strong>
                        <small>{application.candidateEmail}</small>
                      </td>

                      <td>
                        <strong>{application.jobTitle}</strong>
                        <small>{application.job?.category || "No category"}</small>
                      </td>

                      <td>{application.companyName}</td>

                      <td>
                        <select
                          className={`admin-select-status ${application.status}`}
                          value={application.status}
                          onChange={(e) =>
                            handleUpdateApplicationStatus(
                              application._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview">Interview</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      <td>{renderDate(application.createdAt)}</td>
                    </tr>
                  ))}

                  {applications.length === 0 && (
                    <tr>
                      <td colSpan="5">No applications found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "reviews" && (
          <section className="company-dashboard-card admin-page-card">
            <div className="company-card-header">
              <div>
                <h2>Reviews</h2>
                <p>Manage real platform reviews.</p>
              </div>

              <span>{reviews.length} reviews</span>
            </div>

            <div className="admin-reviews-grid">
              {reviews.map((review) => (
                <div className="admin-review-card" key={review._id}>
                  <div>
                    <h3>{review.name}</h3>
                    <span>{review.rating}/5 ★</span>
                  </div>

                  <p>{review.comment}</p>

                  <small>
                    {review.role} • {renderDate(review.createdAt)}
                  </small>

                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() =>
                      openDeleteModal(
                        "review",
                        review._id,
                        "Delete Review",
                        `Are you sure you want to delete the review from ${review.name}?`
                      )
                    }
                  >
                    Delete Review
                  </button>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="company-empty-box">
                  <h3>No reviews found.</h3>
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;