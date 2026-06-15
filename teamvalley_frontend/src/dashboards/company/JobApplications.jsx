import React, { useCallback, useEffect, useState } from "react";
import InlineMessage from "../../components/InlineMessage";
import { useInlineMessage } from "../../hooks/useInlineMessage";

function JobApplications() {
  const API_URL = "http://localhost:5000/api/applications";
  const DASHBOARD_API_URL = "http://localhost:5000/api/company/dashboard";
  const token = localStorage.getItem("jobvalleyToken");

  const { message, showMessage } = useInlineMessage();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    pages: 1,
  });

  const [totalShown, setTotalShown] = useState(0);

  const [applicationStats, setApplicationStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    interviewApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [interviewForm, setInterviewForm] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewMode: "Online",
    interviewLocation: "",
    interviewNote: "",
  });

  const [schedulingInterview, setSchedulingInterview] = useState(false);

  const [notesForm, setNotesForm] = useState({
    companyNote: "",
    candidateRating: 0,
  });

  const [savingNotes, setSavingNotes] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: "5",
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (appliedSearch.trim() !== "") {
        params.append("search", appliedSearch.trim());
      }

      const applicationsResponse = await fetch(`${API_URL}/company?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dashboardResponse = await fetch(DASHBOARD_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const applicationsResult = await applicationsResponse.json();
      const dashboardResult = await dashboardResponse.json();

      if (!applicationsResponse.ok || !applicationsResult.success) {
        showMessage(
          applicationsResult.message || "Could not load applications.",
          "error"
        );
        setLoading(false);
        return;
      }

      setApplications(applicationsResult.data || []);
      setTotalShown(applicationsResult.total || 0);
      setPagination(
        applicationsResult.pagination || {
          page: 1,
          limit: 5,
          pages: 1,
        }
      );

      if (dashboardResponse.ok && dashboardResult.success) {
        setApplicationStats({
          totalApplications:
            dashboardResult.data.stats?.totalApplications || 0,
          pendingApplications:
            dashboardResult.data.stats?.pendingApplications || 0,
          shortlistedApplications:
            dashboardResult.data.stats?.shortlistedApplications || 0,
          interviewApplications:
            dashboardResult.data.stats?.interviewApplications || 0,
          acceptedApplications:
            dashboardResult.data.stats?.acceptedApplications || 0,
          rejectedApplications:
            dashboardResult.data.stats?.rejectedApplications || 0,
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [token, page, statusFilter, appliedSearch, showMessage]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setAppliedSearch(searchText);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setAppliedSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const handleViewDetails = async (applicationId) => {
    try {
      setDetailsLoading(true);

      const response = await fetch(`${API_URL}/${applicationId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(
          result.message || "Could not load application details.",
          "error"
        );
        setDetailsLoading(false);
        return;
      }

      setSelectedApplication(result.data);

      setInterviewForm({
        interviewDate: result.data.interviewDate || "",
        interviewTime: result.data.interviewTime || "",
        interviewMode: result.data.interviewMode || "Online",
        interviewLocation: result.data.interviewLocation || "",
        interviewNote: result.data.interviewNote || "",
      });

      setNotesForm({
        companyNote: result.data.companyNote || "",
        candidateRating: result.data.candidateRating || 0,
      });

      setDetailsLoading(false);
    } catch (error) {
      setDetailsLoading(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  const closeDetailsModal = () => {
    setSelectedApplication(null);

    setInterviewForm({
      interviewDate: "",
      interviewTime: "",
      interviewMode: "Online",
      interviewLocation: "",
      interviewNote: "",
    });

    setNotesForm({
      companyNote: "",
      candidateRating: 0,
    });
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);

      const response = await fetch(`${API_URL}/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          note: `Company changed status to ${newStatus}.`,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(
          result.message || "Could not update application status.",
          "error"
        );
        setUpdatingId(null);
        return;
      }

      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: result.data.status,
                statusHistory: result.data.statusHistory,
              }
            : application
        )
      );

      if (selectedApplication?._id === applicationId) {
        setSelectedApplication({
          ...selectedApplication,
          status: result.data.status,
          statusHistory: result.data.statusHistory,
        });
      }

      setUpdatingId(null);
      showMessage("Application status updated successfully.", "success");
      fetchApplications();
    } catch (error) {
      setUpdatingId(null);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  const handleInterviewChange = (e) => {
    setInterviewForm({
      ...interviewForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();

    if (!selectedApplication) {
      showMessage("No application selected.", "warning");
      return;
    }

    if (
      interviewForm.interviewDate.trim() === "" ||
      interviewForm.interviewTime.trim() === "" ||
      interviewForm.interviewMode.trim() === ""
    ) {
      showMessage("Please fill interview date, time and mode.", "warning");
      return;
    }

    try {
      setSchedulingInterview(true);

      const response = await fetch(
        `${API_URL}/${selectedApplication._id}/interview`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(interviewForm),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not schedule interview.", "error");
        setSchedulingInterview(false);
        return;
      }

      const updatedApplication = result.data;

      setSelectedApplication({
        ...selectedApplication,
        status: updatedApplication.status,
        statusHistory: updatedApplication.statusHistory,
        interviewDate: updatedApplication.interviewDate,
        interviewTime: updatedApplication.interviewTime,
        interviewMode: updatedApplication.interviewMode,
        interviewLocation: updatedApplication.interviewLocation,
        interviewNote: updatedApplication.interviewNote,
      });

      setSchedulingInterview(false);
      showMessage("Interview scheduled successfully.", "success");
      fetchApplications();
    } catch (error) {
      setSchedulingInterview(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  const handleNotesChange = (e) => {
    setNotesForm({
      ...notesForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();

    if (!selectedApplication) {
      showMessage("No application selected.", "warning");
      return;
    }

    try {
      setSavingNotes(true);

      const response = await fetch(
        `${API_URL}/${selectedApplication._id}/notes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            companyNote: notesForm.companyNote,
            candidateRating: Number(notesForm.candidateRating),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not save notes.", "error");
        setSavingNotes(false);
        return;
      }

      setSelectedApplication({
        ...selectedApplication,
        companyNote: result.data.companyNote,
        candidateRating: result.data.candidateRating,
      });

      setSavingNotes(false);
      showMessage("Notes saved successfully.", "success");
      fetchApplications();
    } catch (error) {
      setSavingNotes(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  return (
    <>
      <section className="company-dashboard-card job-applications-page">
        <div className="company-card-header">
          <div>
            <h2>Job Applications</h2>
            <p>
              Search, filter and manage candidates who applied for your jobs.
            </p>
          </div>

          <span>{totalShown} shown</span>
        </div>

        <InlineMessage message={message} />

        <div className="applications-stats-row applications-stats-row-six">
          <button
            type="button"
            className={statusFilter === "all" ? "active-application-filter" : ""}
            onClick={() => {
              setStatusFilter("all");
              setPage(1);
            }}
          >
            <span>All</span>
            <strong>{applicationStats.totalApplications}</strong>
          </button>

          <button
            type="button"
            className={
              statusFilter === "pending" ? "active-application-filter" : ""
            }
            onClick={() => {
              setStatusFilter("pending");
              setPage(1);
            }}
          >
            <span>Pending</span>
            <strong>{applicationStats.pendingApplications}</strong>
          </button>

          <button
            type="button"
            className={
              statusFilter === "shortlisted" ? "active-application-filter" : ""
            }
            onClick={() => {
              setStatusFilter("shortlisted");
              setPage(1);
            }}
          >
            <span>Shortlisted</span>
            <strong>{applicationStats.shortlistedApplications}</strong>
          </button>

          <button
            type="button"
            className={
              statusFilter === "interview" ? "active-application-filter" : ""
            }
            onClick={() => {
              setStatusFilter("interview");
              setPage(1);
            }}
          >
            <span>Interview</span>
            <strong>{applicationStats.interviewApplications}</strong>
          </button>

          <button
            type="button"
            className={
              statusFilter === "accepted" ? "active-application-filter" : ""
            }
            onClick={() => {
              setStatusFilter("accepted");
              setPage(1);
            }}
          >
            <span>Accepted</span>
            <strong>{applicationStats.acceptedApplications}</strong>
          </button>

          <button
            type="button"
            className={
              statusFilter === "rejected" ? "active-application-filter" : ""
            }
            onClick={() => {
              setStatusFilter("rejected");
              setPage(1);
            }}
          >
            <span>Rejected</span>
            <strong>{applicationStats.rejectedApplications}</strong>
          </button>
        </div>

        <form
          className="applications-search-row applications-search-row-three"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by candidate name, email or job title..."
          />

          <button type="submit">Search</button>

          <button type="button" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </form>

        {detailsLoading && (
          <div className="company-empty-box">
            <h3>Loading application details...</h3>
          </div>
        )}

        {loading ? (
          <div className="company-empty-box">
            <h3>Loading applications...</h3>
            <p>Please wait while applications are loading.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="company-empty-box">
            <h3>No applications found</h3>
            <p>When candidates apply or when filters match, they will appear here.</p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <div className="application-card" key={application._id}>
                <div className="application-main">
                  <div className="candidate-avatar">
                    {application.candidateName
                      ? application.candidateName.charAt(0).toUpperCase()
                      : "C"}
                  </div>

                  <div>
                    <h3>{application.candidateName}</h3>
                    <p>{application.candidateEmail}</p>
                    <p>{application.candidatePhone || "No phone number"}</p>
                  </div>
                </div>

                <div className="application-job-info">
                  <span>Applied For</span>
                  <h4>{application.jobTitle}</h4>
                  <p>{application.companyName}</p>
                </div>

                <div className="application-cover-letter">
                  <span>Cover Letter</span>
                  <p>
                    {application.coverLetter
                      ? application.coverLetter
                      : "No cover letter provided."}
                  </p>
                </div>

                <div className="application-date">
                  <span>Date Applied</span>
                  <strong>
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : "Not specified"}
                  </strong>
                </div>

                <div className="application-status-box">
                  <span>Status</span>

                  <select
                    value={application.status}
                    onChange={(e) =>
                      handleStatusChange(application._id, e.target.value)
                    }
                    disabled={updatingId === application._id}
                    className={`application-status ${application.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  {updatingId === application._id && <small>Updating...</small>}

                  <button
                    type="button"
                    className="view-application-btn"
                    onClick={() => handleViewDetails(application._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
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

      {selectedApplication && (
        <div className="application-details-modal-overlay">
          <div className="application-details-modal">
            <div className="application-details-header">
              <div>
                <h2>Application Details</h2>
                <p>
                  Candidate information, interview scheduling, notes and history.
                </p>
              </div>

              <button type="button" onClick={closeDetailsModal}>
                ×
              </button>
            </div>

            <InlineMessage message={message} />

            <div className="application-details-grid">
              <div className="application-details-card">
                <h3>Candidate Information</h3>

                <p>
                  <span>Name</span>
                  <strong>{selectedApplication.candidateName}</strong>
                </p>

                <p>
                  <span>Email</span>
                  <strong>{selectedApplication.candidateEmail}</strong>
                </p>

                <p>
                  <span>Phone</span>
                  <strong>
                    {selectedApplication.candidatePhone || "Not provided"}
                  </strong>
                </p>
              </div>

              <div className="application-details-card">
                <h3>Job Information</h3>

                <p>
                  <span>Job Title</span>
                  <strong>{selectedApplication.jobTitle}</strong>
                </p>

                <p>
                  <span>Category</span>
                  <strong>
                    {selectedApplication.job?.category || "Not specified"}
                  </strong>
                </p>

                <p>
                  <span>Location</span>
                  <strong>
                    {selectedApplication.job?.location || "Not specified"}
                  </strong>
                </p>

                <p>
                  <span>Salary</span>
                  <strong>
                    {selectedApplication.job?.salary || "Not specified"}
                  </strong>
                </p>
              </div>
            </div>

            <div className="application-details-card full">
              <h3>Cover Letter</h3>

              <p className="application-details-text">
                {selectedApplication.coverLetter ||
                  "No cover letter provided by candidate."}
              </p>
            </div>

            <div className="application-details-card full">
              <h3>Schedule Interview</h3>

              <form
                className="interview-schedule-form"
                onSubmit={handleScheduleInterview}
              >
                <div className="interview-form-grid">
                  <div className="company-form-group">
                    <label>Interview Date *</label>
                    <input
                      type="date"
                      name="interviewDate"
                      value={interviewForm.interviewDate}
                      onChange={handleInterviewChange}
                    />
                  </div>

                  <div className="company-form-group">
                    <label>Interview Time *</label>
                    <input
                      type="time"
                      name="interviewTime"
                      value={interviewForm.interviewTime}
                      onChange={handleInterviewChange}
                    />
                  </div>

                  <div className="company-form-group">
                    <label>Interview Mode *</label>
                    <select
                      name="interviewMode"
                      value={interviewForm.interviewMode}
                      onChange={handleInterviewChange}
                    >
                      <option value="Online">Online</option>
                      <option value="In Office">In Office</option>
                      <option value="Phone Call">Phone Call</option>
                    </select>
                  </div>

                  <div className="company-form-group">
                    <label>Location / Link</label>
                    <input
                      type="text"
                      name="interviewLocation"
                      value={interviewForm.interviewLocation}
                      onChange={handleInterviewChange}
                      placeholder="Google Meet, office address, phone..."
                    />
                  </div>
                </div>

                <div className="company-form-group">
                  <label>Interview Note</label>
                  <textarea
                    name="interviewNote"
                    value={interviewForm.interviewNote}
                    onChange={handleInterviewChange}
                    placeholder="Write interview instructions or notes..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="company-primary-btn"
                  disabled={schedulingInterview}
                >
                  {schedulingInterview ? "Scheduling..." : "Schedule Interview"}
                </button>
              </form>
            </div>

            <div className="application-details-card full">
              <h3>Company Notes</h3>

              <form className="company-notes-form" onSubmit={handleSaveNotes}>
                <div className="company-form-group">
                  <label>Candidate Rating</label>
                  <select
                    name="candidateRating"
                    value={notesForm.candidateRating}
                    onChange={handleNotesChange}
                  >
                    <option value="0">No rating</option>
                    <option value="1">1 star</option>
                    <option value="2">2 stars</option>
                    <option value="3">3 stars</option>
                    <option value="4">4 stars</option>
                    <option value="5">5 stars</option>
                  </select>
                </div>

                <div className="company-form-group">
                  <label>Private Note</label>
                  <textarea
                    name="companyNote"
                    value={notesForm.companyNote}
                    onChange={handleNotesChange}
                    placeholder="Write private notes about this candidate..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="company-primary-btn"
                  disabled={savingNotes}
                >
                  {savingNotes ? "Saving Notes..." : "Save Notes"}
                </button>
              </form>
            </div>

            {(selectedApplication.interviewDate ||
              selectedApplication.interviewTime ||
              selectedApplication.interviewMode) && (
              <div className="application-details-card full interview-info-box">
                <h3>Interview Information</h3>

                <p>
                  <span>Date</span>
                  <strong>
                    {selectedApplication.interviewDate || "Not specified"}
                  </strong>
                </p>

                <p>
                  <span>Time</span>
                  <strong>
                    {selectedApplication.interviewTime || "Not specified"}
                  </strong>
                </p>

                <p>
                  <span>Mode</span>
                  <strong>
                    {selectedApplication.interviewMode || "Not specified"}
                  </strong>
                </p>

                <p>
                  <span>Location / Link</span>
                  <strong>
                    {selectedApplication.interviewLocation || "Not specified"}
                  </strong>
                </p>

                <p>
                  <span>Note</span>
                  <strong>
                    {selectedApplication.interviewNote || "No note"}
                  </strong>
                </p>
              </div>
            )}

            <div className="application-details-card full">
              <h3>Status History</h3>

              {selectedApplication.statusHistory?.length > 0 ? (
                <div className="status-history-list">
                  {selectedApplication.statusHistory
                    .slice()
                    .reverse()
                    .map((historyItem, index) => (
                      <div className="status-history-item" key={index}>
                        <div>
                          <span className={`mini-status ${historyItem.status}`}>
                            {historyItem.status}
                          </span>

                          <p>{historyItem.note || "Status updated."}</p>
                        </div>

                        <strong>
                          {historyItem.changedAt
                            ? new Date(historyItem.changedAt).toLocaleString()
                            : "No date"}
                        </strong>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="company-empty-small">
                  <p>No status history yet.</p>
                </div>
              )}
            </div>

            <div className="application-details-footer">
              <div>
                <span>Current Status</span>

                <select
                  value={selectedApplication.status}
                  onChange={(e) =>
                    handleStatusChange(selectedApplication._id, e.target.value)
                  }
                  disabled={updatingId === selectedApplication._id}
                  className={`application-status ${selectedApplication.status}`}
                >
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <button type="button" onClick={closeDetailsModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobApplications;