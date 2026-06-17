import React, { useCallback, useEffect, useState } from "react";
import InlineMessage from "../../components/InlineMessage";
import { useInlineMessage } from "../../hooks/useInlineMessage";

function CompanyAnalytics() {
  const API_URL = "http://localhost:5000/api/company/analytics";
  const token = localStorage.getItem("jobvalleyToken");

  const { message, showMessage } = useInlineMessage();

  const [loading, setLoading] = useState(false);

  const [analytics, setAnalytics] = useState({
    summary: {
      totalJobs: 0,
      activeJobs: 0,
      closedJobs: 0,
      totalApplications: 0,
    },
    jobsByStatus: {
      active: 0,
      closed: 0,
    },
    applicationsByStatus: {
      pending: 0,
      shortlisted: 0,
      interview: 0,
      accepted: 0,
      rejected: 0,
    },
    applicationsPerJob: [],
    topJobs: [],
    recentActivity: [],
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not load analytics.", "error");
        setLoading(false);
        return;
      }

      setAnalytics(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [token, showMessage]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const maxApplicants = Math.max(
    ...analytics.applicationsPerJob.map((job) => job.applicants),
    1
  );

  const getBarWidth = (value) => {
    return `${Math.max((value / maxApplicants) * 100, 6)}%`;
  };

  return (
    <section className="company-dashboard-card company-analytics-page">
      <div className="company-card-header">
        <div>
          <h2>Company Analytics</h2>
          <p>Track job performance and application activity.</p>
        </div>

        <span>Live data</span>
      </div>

      <InlineMessage message={message} />

      {loading ? (
        <div className="company-empty-box">
          <h3>Loading analytics...</h3>
          <p>Please wait while analytics are loading.</p>
        </div>
      ) : (
        <>
          <section className="analytics-summary-grid">
            <div className="analytics-summary-card">
              <p>Total Jobs</p>
              <h3>{analytics.summary.totalJobs}</h3>
            </div>

            <div className="analytics-summary-card">
              <p>Active Jobs</p>
              <h3>{analytics.summary.activeJobs}</h3>
            </div>

            <div className="analytics-summary-card">
              <p>Closed Jobs</p>
              <h3>{analytics.summary.closedJobs}</h3>
            </div>

            <div className="analytics-summary-card">
              <p>Total Applications</p>
              <h3>{analytics.summary.totalApplications}</h3>
            </div>
          </section>

          <section className="analytics-grid">
            <div className="analytics-card">
              <div className="company-card-header">
                <h2>Applications by Status</h2>
                <span>Status</span>
              </div>

              <div className="analytics-status-list">
                <p>
                  <span className="mini-status pending">Pending</span>
                  <strong>{analytics.applicationsByStatus.pending}</strong>
                </p>

                <p>
                  <span className="mini-status shortlisted">Shortlisted</span>
                  <strong>{analytics.applicationsByStatus.shortlisted}</strong>
                </p>

                <p>
                  <span className="mini-status interview">Interview</span>
                  <strong>{analytics.applicationsByStatus.interview}</strong>
                </p>

                <p>
                  <span className="mini-status accepted">Accepted</span>
                  <strong>{analytics.applicationsByStatus.accepted}</strong>
                </p>

                <p>
                  <span className="mini-status rejected">Rejected</span>
                  <strong>{analytics.applicationsByStatus.rejected}</strong>
                </p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="company-card-header">
                <h2>Jobs by Status</h2>
                <span>Jobs</span>
              </div>

              <div className="analytics-jobs-status">
                <div>
                  <h3>{analytics.jobsByStatus.active}</h3>
                  <p>Active Jobs</p>
                </div>

                <div>
                  <h3>{analytics.jobsByStatus.closed}</h3>
                  <p>Closed Jobs</p>
                </div>
              </div>
            </div>
          </section>

          <section className="analytics-card full">
            <div className="company-card-header">
              <h2>Applications per Job</h2>
              <span>{analytics.applicationsPerJob.length} jobs</span>
            </div>

            {analytics.applicationsPerJob.length === 0 ? (
              <div className="company-empty-small">
                <p>No jobs available yet.</p>
              </div>
            ) : (
              <div className="analytics-bar-list">
                {analytics.applicationsPerJob.map((job) => (
                  <div className="analytics-bar-item" key={job.jobId}>
                    <div className="analytics-bar-info">
                      <h3>{job.title}</h3>
                      <p>
                        {job.type} • {job.location} • {job.status}
                      </p>
                    </div>

                    <div className="analytics-bar-track">
                      <div
                        className="analytics-bar-fill"
                        style={{ width: getBarWidth(job.applicants) }}
                      ></div>
                    </div>

                    <strong>{job.applicants}</strong>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="analytics-grid">
            <div className="analytics-card">
              <div className="company-card-header">
                <h2>Top Jobs</h2>
                <span>Most applicants</span>
              </div>

              {analytics.topJobs.length === 0 ? (
                <div className="company-empty-small">
                  <p>No top jobs yet.</p>
                </div>
              ) : (
                <div className="top-jobs-list">
                  {analytics.topJobs.map((job, index) => (
                    <div className="top-job-item" key={job.jobId}>
                      <span>#{index + 1}</span>

                      <div>
                        <h3>{job.title}</h3>
                        <p>{job.location}</p>
                      </div>

                      <strong>{job.applicants}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="analytics-card">
              <div className="company-card-header">
                <h2>Recent Activity</h2>
                <span>History</span>
              </div>

              {analytics.recentActivity.length === 0 ? (
                <div className="company-empty-small">
                  <p>No recent activity yet.</p>
                </div>
              ) : (
                <div className="analytics-activity-list">
                  {analytics.recentActivity.map((activity, index) => (
                    <div className="analytics-activity-item" key={index}>
                      <span className={`mini-status ${activity.status}`}>
                        {activity.status}
                      </span>

                      <div>
                        <h3>{activity.candidateName}</h3>
                        <p>{activity.jobTitle}</p>
                        <small>{activity.note || "Status updated."}</small>
                      </div>

                      <strong>
                        {activity.changedAt
                          ? new Date(activity.changedAt).toLocaleDateString()
                          : "No date"}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </section>
  );
}

export default CompanyAnalytics;