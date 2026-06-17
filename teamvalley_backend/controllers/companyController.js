const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

const cleanString = (value) => {
  return typeof value === "string" ? value.trim() : value;
};

const isEmpty = (value) => {
  return !value || String(value).trim() === "";
};

const getCompanyProfile = async (req, res) => {
  try {
    const company = await User.findById(req.user._id).select("-password");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log("Get company profile error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCompanyProfile = async (req, res) => {
  try {
    const companyName = cleanString(req.body.companyName);
    const phone = cleanString(req.body.phone);
    const website = cleanString(req.body.website);
    const address = cleanString(req.body.address);
    const industry = cleanString(req.body.industry);
    const companySize = cleanString(req.body.companySize);
    const description = cleanString(req.body.description);
    const logo = req.body.logo;

    const company = await User.findById(req.user._id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (typeof companyName !== "undefined" && isEmpty(companyName)) {
      return res.status(400).json({
        success: false,
        message: "Company name cannot be empty.",
      });
    }

    if (typeof phone !== "undefined" && isEmpty(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number cannot be empty.",
      });
    }

    if (typeof logo !== "undefined" && logo && logo.length > 4000000) {
      return res.status(400).json({
        success: false,
        message: "Logo is too large. Please upload a smaller image.",
      });
    }

    if (typeof companyName !== "undefined") {
      company.companyName = companyName;
    }

    if (typeof phone !== "undefined") {
      company.phone = phone;
    }

    if (typeof website !== "undefined") {
      company.website = website || "";
    }

    if (typeof address !== "undefined") {
      company.address = address || "";
    }

    if (typeof industry !== "undefined") {
      company.industry = industry || "";
    }

    if (typeof companySize !== "undefined") {
      company.companySize = companySize || "";
    }

    if (typeof description !== "undefined") {
      company.description = description || "";
    }

    if (typeof logo !== "undefined") {
      company.logo = logo || "";
    }

    const updatedCompany = await company.save();

    res.status(200).json({
      success: true,
      message: "Company profile updated successfully.",
      data: {
        id: updatedCompany._id,
        role: updatedCompany.role,
        companyName: updatedCompany.companyName,
        nipt: updatedCompany.nipt,
        email: updatedCompany.email,
        phone: updatedCompany.phone,
        website: updatedCompany.website,
        address: updatedCompany.address,
        industry: updatedCompany.industry,
        companySize: updatedCompany.companySize,
        description: updatedCompany.description,
        logo: updatedCompany.logo,
      },
    });
  } catch (error) {
    console.log("Update company profile error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanyDashboard = async (req, res) => {
  try {
    const company = await User.findById(req.user._id).select("-password");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const jobs = await Job.find({
      company: req.user._id,
    }).sort({ createdAt: -1 });

    const applications = await Application.find({
      company: req.user._id,
    })
      .populate("job", "title category type location salary deadline status")
      .populate("candidate", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job) => job.status === "active").length;
    const closedJobs = jobs.filter((job) => job.status === "closed").length;

    const totalApplicants = jobs.reduce((total, job) => {
      return total + Number(job.applicants || 0);
    }, 0);

    const totalApplications = applications.length;

    const pendingApplications = applications.filter(
      (application) => application.status === "pending"
    ).length;

    const shortlistedApplications = applications.filter(
      (application) => application.status === "shortlisted"
    ).length;

    const interviewApplications = applications.filter(
      (application) => application.status === "interview"
    ).length;

    const acceptedApplications = applications.filter(
      (application) => application.status === "accepted"
    ).length;

    const rejectedApplications = applications.filter(
      (application) => application.status === "rejected"
    ).length;

    res.status(200).json({
      success: true,
      data: {
        company,
        jobs,
        applications,
        recentJobs: jobs.slice(0, 4),
        recentApplications: applications.slice(0, 4),
        stats: {
          totalJobs,
          activeJobs,
          closedJobs,
          totalApplicants,
          totalApplications,
          pendingApplications,
          shortlistedApplications,
          interviewApplications,
          acceptedApplications,
          rejectedApplications,
        },
      },
    });
  } catch (error) {
    console.log("Company dashboard error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanyAnalytics = async (req, res) => {
  try {
    const jobs = await Job.find({
      company: req.user._id,
    }).sort({ createdAt: -1 });

    const applications = await Application.find({
      company: req.user._id,
    }).sort({ createdAt: -1 });

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job) => job.status === "active").length;
    const closedJobs = jobs.filter((job) => job.status === "closed").length;

    const totalApplications = applications.length;

    const applicationsByStatus = {
      pending: applications.filter((item) => item.status === "pending").length,
      shortlisted: applications.filter((item) => item.status === "shortlisted")
        .length,
      interview: applications.filter((item) => item.status === "interview")
        .length,
      accepted: applications.filter((item) => item.status === "accepted")
        .length,
      rejected: applications.filter((item) => item.status === "rejected")
        .length,
    };

    const applicationsPerJob = jobs.map((job) => {
      const jobApplications = applications.filter(
        (application) => application.job.toString() === job._id.toString()
      );

      return {
        jobId: job._id,
        title: job.title,
        status: job.status,
        location: job.location,
        type: job.type,
        applicants: jobApplications.length,
      };
    });

    const topJobs = [...applicationsPerJob]
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 5);

    const recentActivity = [];

    applications.forEach((application) => {
      if (application.statusHistory && application.statusHistory.length > 0) {
        application.statusHistory.forEach((history) => {
          recentActivity.push({
            applicationId: application._id,
            candidateName: application.candidateName,
            jobTitle: application.jobTitle,
            status: history.status,
            note: history.note,
            changedAt: history.changedAt,
          });
        });
      }
    });

    recentActivity.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalJobs,
          activeJobs,
          closedJobs,
          totalApplications,
        },
        jobsByStatus: {
          active: activeJobs,
          closed: closedJobs,
        },
        applicationsByStatus,
        applicationsPerJob,
        topJobs,
        recentActivity: recentActivity.slice(0, 8),
      },
    });
  } catch (error) {
    console.log("Company analytics error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const fs = require("fs");
const path = require("path");

const deleteLocalFile = (fileUrl) => {
  if (!fileUrl || !fileUrl.startsWith("/uploads/")) {
    return;
  }

  const filePath = path.join(__dirname, "..", fileUrl);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const updateCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a logo image.",
      });
    }

    const company = await User.findById(req.user._id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const oldLogo = company.logo;

    const logoPath = `/uploads/logos/${req.file.filename}`;

    company.logo = logoPath;

    const updatedCompany = await company.save();

    if (oldLogo && oldLogo.startsWith("/uploads/logos/")) {
      deleteLocalFile(oldLogo);
    }

    res.status(200).json({
      success: true,
      message: "Logo uploaded successfully.",
      data: {
        id: updatedCompany._id,
        role: updatedCompany.role,
        companyName: updatedCompany.companyName,
        nipt: updatedCompany.nipt,
        email: updatedCompany.email,
        phone: updatedCompany.phone,
        website: updatedCompany.website,
        address: updatedCompany.address,
        industry: updatedCompany.industry,
        companySize: updatedCompany.companySize,
        description: updatedCompany.description,
        logo: updatedCompany.logo,
      },
    });
  } catch (error) {
    console.log("Upload company logo error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeCompanyLogo = async (req, res) => {
  try {
    const company = await User.findById(req.user._id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const oldLogo = company.logo;

    company.logo = "";

    const updatedCompany = await company.save();

    if (oldLogo && oldLogo.startsWith("/uploads/logos/")) {
      deleteLocalFile(oldLogo);
    }

    res.status(200).json({
      success: true,
      message: "Logo removed successfully.",
      data: {
        id: updatedCompany._id,
        role: updatedCompany.role,
        companyName: updatedCompany.companyName,
        nipt: updatedCompany.nipt,
        email: updatedCompany.email,
        phone: updatedCompany.phone,
        website: updatedCompany.website,
        address: updatedCompany.address,
        industry: updatedCompany.industry,
        companySize: updatedCompany.companySize,
        description: updatedCompany.description,
        logo: updatedCompany.logo,
      },
    });
  } catch (error) {
    console.log("Remove company logo error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyDashboard,
  getCompanyAnalytics,
  updateCompanyLogo,
  removeCompanyLogo,
};