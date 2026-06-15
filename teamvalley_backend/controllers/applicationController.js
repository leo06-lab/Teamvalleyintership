const Application = require("../models/Application");
const Job = require("../models/Job");

const allowedStatuses = [
  "pending",
  "shortlisted",
  "interview",
  "rejected",
  "accepted",
];

const getPagination = (req, defaultLimit = 10) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || defaultLimit, 1),
    50
  );

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const addStatusHistory = (application, status, changedBy, note = "") => {
  application.statusHistory.push({
    status,
    changedBy,
    note,
    changedAt: new Date(),
  });
};

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

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

    const application = await Application.create({
      job: job._id,
      company: job.company,
      candidate: req.user._id,
      candidateName,
      candidateEmail: req.user.email,
      candidatePhone: req.user.phone || "",
      jobTitle: job.title,
      companyName: job.companyName,
      coverLetter: coverLetter || "",
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

    job.applicants = job.applicants + 1;
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

    const status = req.query.status;
    const search = req.query.search;

    const filter = {
      company: req.user._id,
    };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { candidateName: { $regex: search, $options: "i" } },
        { candidateEmail: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }

    const totalApplications = await Application.countDocuments(filter);

    const applications = await Application.find(filter)
      .populate("job", "title category type location salary deadline status")
      .populate("candidate", "firstName lastName email phone")
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
      .populate("candidate", "firstName lastName email phone")
      .populate(
        "company",
        "companyName email phone logo industry website address"
      )
      .populate(
        "statusHistory.changedBy",
        "firstName lastName companyName email role"
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.company._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can view only applications for your company.",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
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

    const status = req.query.status;

    const filter = {
      candidate: req.user._id,
    };

    if (status && status !== "all") {
      filter.status = status;
    }

    const totalApplications = await Application.countDocuments(filter);

    const applications = await Application.find(filter)
      .populate("job", "title category type location salary deadline status")
      .populate("company", "companyName email phone website industry logo")
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
      addStatusHistory(
        application,
        "interview",
        req.user._id,
        "Interview scheduled by company."
      );
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

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Candidate rating must be between 0 and 5.",
      });
    }

    application.companyNote = companyNote || "";
    application.candidateRating = rating || 0;

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

module.exports = {
  applyForJob,
  getCompanyApplications,
  getApplicationById,
  getMyApplications,
  updateApplicationStatus,
  scheduleInterview,
  updateApplicationNotes,
};