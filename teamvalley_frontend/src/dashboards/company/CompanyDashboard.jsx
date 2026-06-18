import React, { useCallback, useEffect, useState } from "react";
import CompanyProfile from "./CompanyProfile";
import CreateJob from "./CreateJob";
import ManageJobs from "./ManageJobs";
import JobApplications from "./JobApplications";
import CompanyAnalytics from "./CompanyAnalytics";
import "../../styles/DashboardCompany.css";
import { getImageUrl } from "../../utils/getImageUrl";
import InlineMessage from "../../components/InlineMessage";
import { useInlineMessage } from "../../hooks/useInlineMessage";
import Logo from "../../assets/images/websiteLogo.png";

const COMPANY_DASHBOARD_API_URL = "http://localhost:5000/api/company/dashboard";

function CompanyDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const loggedUser = JSON.parse(localStorage.getItem("jobvalleyUser"));
  const token = localStorage.getItem("jobvalleyToken");
  const { message, showMessage } = useInlineMessage();

  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplicants: 0,
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });

  const companyName =
    companyProfile?.companyName || loggedUser?.companyName || "Company Account";

  const companyLogo = getImageUrl(companyProfile?.logo || "");

  const fetchDashboardData = useCallback(async () => {
    try {
      setDashboardLoading(true);

      const response = await fetch(COMPANY_DASHBOARD_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not load dashboard data.", "error");
        setDashboardLoading(false);
        return;
      }

      setCompanyProfile(result.data.company || null);
      setApplications(result.data.applications || []);

      setStats({
        totalJobs: result.data.stats?.totalJobs || 0,
        activeJobs: result.data.stats?.activeJobs || 0,
        closedJobs: result.data.stats?.closedJobs || 0,
        totalApplicants: result.data.stats?.totalApplicants || 0,
        totalApplications: result.data.stats?.totalApplications || 0,
        pendingApplications: result.data.stats?.pendingApplications || 0,
        shortlistedApplications: result.data.stats?.shortlistedApplications || 0,
        acceptedApplications: result.data.stats?.acceptedApplications || 0,
        rejectedApplications: result.data.stats?.rejectedApplications || 0,
      });

      setDashboardLoading(false);
    } catch (error) {
      setDashboardLoading(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [token, showMessage]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const recentApplications = applications.slice(0, 4);

  const maxApplicationStatus = Math.max(
    stats.pendingApplications,
    stats.shortlistedApplications,
    stats.acceptedApplications,
    stats.rejectedApplications,
    1
  );

  const getBarHeight = (value) => {
    return `${Math.max((value / maxApplicationStatus) * 100, 8)}%`;
  };

  return (
    <main className="company-dashboard-layout">
      <aside className="company-sidebar">
        <div className="company-sidebar-logo">
          <img src={Logo} alt="Job Valley Logo" width="200" height="200" />
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
            className={activePage === "jobs" ? "active-company-menu" : ""}
            onClick={() => setActivePage("jobs")}
          >
            Jobs
          </button>

          <button
            type="button"
            className={activePage === "create" ? "active-company-menu" : ""}
            onClick={() => setActivePage("create")}
          >
            Create Job
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
            className={activePage === "analytics" ? "active-company-menu" : ""}
            onClick={() => setActivePage("analytics")}
          >
            Analytics
          </button>

          <button
            type="button"
            className={activePage === "profile" ? "active-company-menu" : ""}
            onClick={() => setActivePage("profile")}
          >
            Company Profile
          </button>
        </nav>
      </aside>

      <section className="company-dashboard-main">
        <header className="company-dashboard-topbar">
          <div>
            <h1>
              {activePage === "dashboard" && "Dashboard"}
              {activePage === "jobs" && "Manage Jobs"}
              {activePage === "create" && "Create Job"}
              {activePage === "applications" && "Job Applications"}
              {activePage === "profile" && "Company Profile"}
              {activePage === "analytics" && "Analytics"}
            </h1>

            <p>Welcome back, {companyName}</p>
          </div>

          <div className="company-topbar-profile">
            <div className="company-avatar">
              {companyLogo ? (
                <img src={companyLogo} alt={`${companyName} logo`} />
              ) : (
                <span>{companyName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div>
              <h3>{companyName}</h3>
              <span>Company HR</span>
            </div>
          </div>
        </header>

        <InlineMessage message={message} />

        {activePage === "dashboard" && (
          <div className="company-dashboard-home">
            {dashboardLoading && (
              <div className="company-empty-box">
                <h3>Loading dashboard data...</h3>
                <p>Please wait while we load your company statistics.</p>
              </div>
            )}

            <section className="company-stats-grid">
              <div className="company-stat-card green">
                <p>Total Applications</p>
                <h2>{stats.totalApplications}</h2>
                <span>Real data</span>
              </div>

              <div className="company-stat-card">
                <p>Shortlisted</p>
                <h2>{stats.shortlistedApplications}</h2>
                <span>From applications</span>
              </div>

              <div className="company-stat-card">
                <p>Accepted</p>
                <h2>{stats.acceptedApplications}</h2>
                <span>Hired candidates</span>
              </div>

              <div className="company-stat-card">
                <p>Rejected</p>
                <h2>{stats.rejectedApplications}</h2>
                <span>Rejected candidates</span>
              </div>
            </section>

            <section className="company-stats-grid company-job-stats-grid">
              <div className="company-stat-card">
                <p>Total Jobs</p>
                <h2>{stats.totalJobs}</h2>
                <span>All posted jobs</span>
              </div>

              <div className="company-stat-card">
                <p>Active Jobs</p>
                <h2>{stats.activeJobs}</h2>
                <span>Visible in Find a Job</span>
              </div>

              <div className="company-stat-card">
                <p>Closed Jobs</p>
                <h2>{stats.closedJobs}</h2>
                <span>Not visible publicly</span>
              </div>

              <div className="company-stat-card">
                <p>Pending</p>
                <h2>{stats.pendingApplications}</h2>
                <span>Waiting review</span>
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
                        style={{
                          height: getBarHeight(stats.pendingApplications),
                        }}
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
                          height: getBarHeight(stats.acceptedApplications),
                        }}
                      ></div>
                    </div>
                    <span>Accepted</span>
                    <strong>{stats.acceptedApplications}</strong>
                  </div>

                  <div className="company-real-bar-item">
                    <div className="company-real-bar-track">
                      <div
                        className="company-real-bar-fill"
                        style={{
                          height: getBarHeight(stats.rejectedApplications),
                        }}
                      ></div>
                    </div>
                    <span>Rejected</span>
                    <strong>{stats.rejectedApplications}</strong>
                  </div>
                </div>
              </div>

              <div className="company-dashboard-card">
                <div className="company-card-header">
                  <h2>Jobs Overview</h2>
                  <span>Live</span>
                </div>

                <div className="company-department-list">
                  <p>
                    <span></span> Total Jobs{" "}
                    <strong>{stats.totalJobs}</strong>
                  </p>

                  <p>
                    <span></span> Active Jobs{" "}
                    <strong>{stats.activeJobs}</strong>
                  </p>

                  <p>
                    <span></span> Closed Jobs{" "}
                    <strong>{stats.closedJobs}</strong>
                  </p>

                  <p>
                    <span></span> Total Applicants{" "}
                    <strong>{stats.totalApplicants}</strong>
                  </p>
                </div>
              </div>

              <div className="company-dashboard-card resources-card">
                <h2>Application Status</h2>

                <div className="resources-circle">
                  <h3>{stats.totalApplications}</h3>
                  <p>Total Applications</p>
                </div>

                <div className="resources-list">
                  <p>
                    <strong>{stats.pendingApplications}</strong> Pending
                  </p>

                  <p>
                    <strong>{stats.shortlistedApplications}</strong> Shortlisted
                  </p>

                  <p>
                    <strong>{stats.acceptedApplications}</strong> Accepted
                  </p>

                  <p>
                    <strong>{stats.rejectedApplications}</strong> Rejected
                  </p>
                </div>
              </div>
            </section>

            <section className="company-bottom-grid">
              <ManageJobs compact />

              <div className="company-dashboard-card recent-applications-card">
                <div className="company-card-header">
                  <h2>Recent Applications</h2>
                  <span>{recentApplications.length}</span>
                </div>

                {recentApplications.length === 0 ? (
                  <div className="company-empty-small">
                    <p>No applications yet.</p>
                  </div>
                ) : (
                  <div className="recent-applications-list">
                    {recentApplications.map((application) => (
                      <div
                        className="recent-application-item"
                        key={application._id}
                      >
                        <div>
                          <h3>{application.candidateName}</h3>
                          <p>{application.jobTitle}</p>
                        </div>

                        <span className={`mini-status ${application.status}`}>
                          {application.status}
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
                    <span>{stats.activeJobs}</span> Keep active jobs updated
                  </p>

                  <p>
                    <span>{stats.closedJobs}</span> Reopen closed jobs if needed
                  </p>

                  <p>
                    <span>{stats.totalApplications}</span> Track all candidates
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activePage === "jobs" && <ManageJobs />}

        {activePage === "create" && <CreateJob />}

        {activePage === "applications" && <JobApplications />}

        {activePage === "profile" && <CompanyProfile />}

        {activePage === "analytics" && <CompanyAnalytics />}
      </section>
    </main>
  );
}

export default CompanyDashboard;