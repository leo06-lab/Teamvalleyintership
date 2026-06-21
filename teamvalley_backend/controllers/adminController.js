const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Review = require("../models/Review");
const ContactMessage = require("../models/ContactMessages");

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalCompanies,
      totalAdmins,
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      interviewApplications,
      acceptedApplications,
      rejectedApplications,
      totalReviews,
      totalContactMessages,
      recentUsers,
      recentJobs,
      recentApplications,
      recentReviews,
      recentContactMessages,
      allReviews,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "company" }),
      User.countDocuments({ role: "admin" }),

      Job.countDocuments(),
      Job.countDocuments({ status: "active" }),
      Job.countDocuments({ status: "closed" }),

      Application.countDocuments(),
      Application.countDocuments({ status: "pending" }),
      Application.countDocuments({ status: "shortlisted" }),
      Application.countDocuments({ status: "interview" }),
      Application.countDocuments({ status: "accepted" }),
      Application.countDocuments({ status: "rejected" }),

      Review.countDocuments(),
  ContactMessage.countDocuments(),

      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5),

      Job.find()
        .populate("company", "companyName logo email")
        .sort({ createdAt: -1 })
        .limit(5),

      Application.find()
        .populate("job", "title category location")
        .populate("candidate", "firstName lastName email")
        .populate("company", "companyName email")
        .sort({ createdAt: -1 })
        .limit(5),

      Review.find().sort({ createdAt: -1 }).limit(5),

  ContactMessage.find().sort({ createdAt: -1 }).limit(5),

      Review.find(),
    ]);

    const ratingSum = allReviews.reduce((sum, review) => {
      return sum + review.rating;
    }, 0);

    const averageRating =
      allReviews.length > 0
        ? Number((ratingSum / allReviews.length).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCandidates,
          totalCompanies,
          totalAdmins,
          totalJobs,
          activeJobs,
          closedJobs,
          totalApplications,
          pendingApplications,
          shortlistedApplications,
          interviewApplications,
          acceptedApplications,
          rejectedApplications,
          totalReviews,
          totalContactMessages,
          averageRating,
        },
        recentUsers,
        recentJobs,
        recentApplications,
        recentReviews,
        recentContactMessages,
      },
    });
  } catch (error) {
    console.log("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load admin dashboard.",
    });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const { role, search } = req.query;

    const query = {};

    if (role && role !== "all") {
      query.role = role;
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { nipt: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.log("Get admin users error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load users.",
    });
  }
};

const deleteAdminUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (String(req.user._id) === String(userId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.log("Delete admin user error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not delete user.",
    });
  }
};

const getAdminJobs = async (req, res) => {
  try {
    const { status, category, search } = req.query;

    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .populate("company", "companyName logo email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.log("Get admin jobs error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load jobs.",
    });
  }
};

const updateAdminJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job status.",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    job.status = status;
    const updatedJob = await job.save();

    res.status(200).json({
      success: true,
      message: "Job status updated successfully.",
      data: updatedJob,
    });
  } catch (error) {
    console.log("Update admin job status error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not update job status.",
    });
  }
};

const deleteAdminJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    await Application.deleteMany({ job: req.params.id });
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job and related applications deleted successfully.",
    });
  } catch (error) {
    console.log("Delete admin job error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not delete job.",
    });
  }
};

const getAdminApplications = async (req, res) => {
  try {
    const { status, search } = req.query;

    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { candidateName: { $regex: search, $options: "i" } },
        { candidateEmail: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await Application.find(query)
      .populate("job", "title category location")
      .populate("candidate", "firstName lastName email")
      .populate("company", "companyName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: applications.length,
      data: applications,
    });
  } catch (error) {
    console.log("Get admin applications error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load applications.",
    });
  }
};

const updateAdminApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "shortlisted",
      "interview",
      "rejected",
      "accepted",
    ];

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

    application.status = status;

    application.statusHistory.push({
      status,
      changedBy: req.user._id,
      note: `Admin changed status to ${status}.`,
    });

    const updatedApplication = await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    console.log("Update admin application status error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not update application status.",
    });
  }
};

const getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.log("Get admin reviews error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load reviews.",
    });
  }
};

const getAdminContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: messages.length,
      data: messages,
    });
  } catch (error) {
    console.log("Get admin contact messages error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load contact messages.",
    });
  }
};

const deleteAdminContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    console.log("Delete admin contact message error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not delete contact message.",
    });
  }
};

const deleteAdminReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.log("Delete admin review error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not delete review.",
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAdminUsers,
  deleteAdminUser,
  getAdminJobs,
  updateAdminJobStatus,
  deleteAdminJob,
  getAdminApplications,
  updateAdminApplicationStatus,
  getAdminReviews,
  getAdminContactMessages,
  deleteAdminContactMessage,
  deleteAdminReview,
};