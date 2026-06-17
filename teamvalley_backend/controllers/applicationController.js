const Application = require("../models/Application");
const Job = require("../models/Job");
const CandidateProfile = require("../models/CandidateProfile");


const allowedStatuses = ["pending", "shortlisted", "interview", "rejected", "accepted"];

const getPagination = (req, defaultLimit = 10) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || defaultLimit, 1),
    50
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const addStatusHistory = (application, status, changedBy, note = "") => {
  application.statusHistory.push({
    status,
    changedBy,
    note,
    changedAt: new Date(),
  });
};

const getCandidateId = (candidate) => {
  if (!candidate) return "";

  if (typeof candidate === "object" && candidate._id) {
    return candidate._id.toString();
  }

  return candidate.toString();
};

const normalizeCvUrl = (cvUrl) => {
  if (!cvUrl) return "";

  if (
    cvUrl.startsWith("http://") ||
    cvUrl.startsWith("https://") ||
    cvUrl.startsWith("data:") ||
    cvUrl.startsWith("blob:")
  ) {
    return cvUrl;
  }

  if (cvUrl.startsWith("/uploads/")) {
    const afterUploads = cvUrl.replace("/uploads/", "");

    if (!afterUploads.includes("/")) {
      return `/uploads/cvs/${afterUploads}`;
    }

    return cvUrl;
  }

  if (cvUrl.startsWith("uploads/")) {
    return `/${cvUrl}`;
  }

  return `/uploads/cvs/${cvUrl}`;
};

const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId || req.body.jobId;
    const { coverLetter = "" } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job id is required.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (job.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This job is not active anymore.",
      });
    }

    const existingApplication = await Application.findOne({
      job: job._id,
      candidate: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const candidateName =
      `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() ||
      req.user.email;

    const candidateProfile = await CandidateProfile.findOne({
      user: req.user._id,
    }).select("cvUrl cvFileName");

    const application = await Application.create({
      job: job._id,
      company: job.company,
      candidate: req.user._id,
      candidateName,
      candidateEmail: req.user.email,
      candidatePhone: req.user.phone || "",
      candidateCVUrl: candidateProfile?.cvUrl || "",
      candidateCVFileName: candidateProfile?.cvFileName || "",
      jobTitle: job.title,
      companyName: job.companyName,
      coverLetter,
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          changedBy: req.user._id,
          note: "Application submitted by candidate.",
          changedAt: new Date(),
        },
      ],
    });

    job.applicants = (job.applicants || 0) + 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: application,
    });
  } catch (error) {
    console.log("Apply for job error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanyApplications = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 5);
    const filter = { company: req.user._id };

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.$or = [
        { candidateName: { $regex: req.query.search, $options: "i" } },
        { candidateEmail: { $regex: req.query.search, $options: "i" } },
        { candidateCVUrl: { $regex: req.query.search, $options: "i" } },
        { jobTitle: { $regex: req.query.search, $options: "i" } },
        { companyName: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const totalApplications = await Application.countDocuments(filter);

    const applications = await Application.find(filter)
      .populate("job", "title category type location salary deadline status")
      .populate("candidate", "firstName lastName email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const candidateIds = applications
      .map((application) => getCandidateId(application.candidate))
      .filter(Boolean);

    const candidateProfiles = await CandidateProfile.find({
      user: { $in: candidateIds },
    }).select("user cvUrl cvFileName");

    const profileByCandidateId = new Map(
      candidateProfiles.map((profile) => [profile.user.toString(), profile])
    );

    const applicationsWithCv = applications.map((application) => {
      const candidateId = getCandidateId(application.candidate);
      const profile = profileByCandidateId.get(candidateId);

      return {
        ...application.toObject(),
        candidateCVUrl: normalizeCvUrl(
          application.candidateCVUrl || profile?.cvUrl || ""
        ),
        candidateCVFileName:
          application.candidateCVFileName || profile?.cvFileName || "",
      };
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      total: totalApplications,
      pagination: {
        page,
        limit,
        pages: Math.ceil(totalApplications / limit) || 1,
      },
      data: applicationsWithCv,
    });
  } catch (error) {
    console.log("Get company applications error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate(
        "job",
        "title category type location salary deadline status description applicants"
      )
      .populate("candidate", "firstName lastName email phone cvUrl")
      .populate("company", "companyName email phone logo industry website address")
      .populate("statusHistory.changedBy", "firstName lastName companyName email role");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const applicationCompanyId =
      application.company && typeof application.company === "object"
        ? application.company._id?.toString()
        : application.company?.toString();

    if (applicationCompanyId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can view only applications for your company.",
      });
    }

    const candidateId = getCandidateId(application.candidate);
    const candidateProfile = await CandidateProfile.findOne({
      user: candidateId,
    }).select("cvUrl cvFileName");

    const applicationData = application.toObject();
    applicationData.candidateCVUrl = normalizeCvUrl(
      application.candidateCVUrl || candidateProfile?.cvUrl || ""
    );
    applicationData.candidateCVFileName =
      application.candidateCVFileName || candidateProfile?.cvFileName || "";

    res.status(200).json({
      success: true,
      data: applicationData,
    });
  } catch (error) {
    console.log("Get application by id error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req, 5);
    const filter = { candidate: req.user._id };

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const totalApplications = await Application.countDocuments(filter);

    const applications = await Application.find(filter)
      .populate("job", "title category type location salary deadline status")
      .populate("company", "companyName email phone website industry logo")
      .populate("candidate", "firstName lastName email phone cvUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: applications.length,
      total: totalApplications,
      pagination: {
        page,
        limit,
        pages: Math.ceil(totalApplications / limit) || 1,
      },
      data: applications,
    });
  } catch (error) {
    console.log("Get my applications error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only applications for your company.",
      });
    }

    if (application.status !== status) {
      application.status = status;
      addStatusHistory(
        application,
        status,
        req.user._id,
        note || `Status changed to ${status}.`
      );
    }

    const updatedApplication = await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    console.log("Update application status error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const scheduleInterview = async (req, res) => {
  try {
    const {
      interviewDate,
      interviewTime,
      interviewMode,
      interviewLocation,
      interviewNote,
    } = req.body;

    if (!interviewDate || !interviewTime || !interviewMode) {
      return res.status(400).json({
        success: false,
        message: "Interview date, time and mode are required.",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can schedule interviews only for your company.",
      });
    }

    const previousStatus = application.status;

    application.status = "interview";
    application.interviewDate = interviewDate;
    application.interviewTime = interviewTime;
    application.interviewMode = interviewMode;
    application.interviewLocation = interviewLocation || "";
    application.interviewNote = interviewNote || "";

    if (previousStatus !== "interview") {
      addStatusHistory(application, "interview", req.user._id, "Interview scheduled by company.");
    }

    const updatedApplication = await application.save();

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    console.log("Schedule interview error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateApplicationNotes = async (req, res) => {
  try {
    const { companyNote, candidateRating } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update notes only for your company applications.",
      });
    }

    const rating = Number(candidateRating);

    if (!Number.isNaN(rating) && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Candidate rating must be between 0 and 5.",
      });
    }

    if (typeof companyNote !== "undefined") {
      application.companyNote = companyNote || "";
    }

    if (!Number.isNaN(rating)) {
      application.candidateRating = rating;
    }

    const updatedApplication = await application.save();

    res.status(200).json({
      success: true,
      message: "Application notes updated successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    console.log("Update application notes error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const isOwner =
      application.candidate.toString() === req.user._id.toString() ||
      application.company.toString() === req.user._id.toString() ||
      req.user.role === "admin";

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this application.",
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.log("Delete application error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  applyForJob,
  getCompanyApplications,
  getApplicationById,
  getMyApplications,
  updateApplicationStatus,
  scheduleInterview,
  updateApplicationNotes,
  deleteApplication,
};
