const CandidateProfile = require("../models/CandidateProfile");
const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

const getDefaultProfileData = (user) => ({
  user: user._id,
  fullName:
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "",
  email: user.email || "",
  phone: user.phone || "",
  address: user.address || "",
  about: "",
  skills: [],
  education: "",
  experience: "",
  linkedin: "",
  github: "",
  portfolio: "",
  cvUrl: "",
  cvFileName: "",
  cvUploadedAt: null,
});

const mapSavedJob = (savedJob) => ({
  _id: savedJob._id,
  jobId: savedJob.job?._id || savedJob.job,
  jobTitle: savedJob.job?.title || "Untitled job",
  companyName: savedJob.job?.companyName || "Company Account",
  location: savedJob.job?.location || "",
  type: savedJob.job?.type || "",
  category: savedJob.job?.category || "",
  salary: savedJob.job?.salary || "",
  status: savedJob.job?.status || "",
  createdAt: savedJob.createdAt,
});

// Controller per te menaxhuar profilet e kandidatit
//Funksioni per te marre profilin e kandidatit
const getProfile = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await CandidateProfile.create(getDefaultProfileData(req.user));
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Gabim në server", error: error.message });
  }
};

// Funksioni per te perditesuar profilin e kandidatit
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      about,
      skills,
      education,
      experience,
      linkedin,
      github,
      portfolio,
    } = req.body;

    const skillsArray =
      typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : Array.isArray(skills)
        ? skills
        : [];

    const updatedProfile = await CandidateProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        fullName,
        email,
        phone,
        address,
        about,
        skills: skillsArray,
        education,
        experience,
        linkedin,
        github,
        portfolio,
      },
      { upsert: true, runValidators: true, returnDocument: "after" }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Gabim në server", error: error.message });
  }
};

// Funksioni per te ngarkuar CV-në e kandidatit
const uploadCv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedProfile = await CandidateProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        cvUrl: `/uploads/cvs/${req.file.filename}`,
        cvFileName: req.file.originalname,
        cvUploadedAt: new Date(),
      },
      { upsert: true, returnDocument: "after" }
    );

    res.status(200).json({
      message: "CV uploaded successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Gabim në server", error: error.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ candidate: req.user._id })
      .populate("job", "title companyName location type category salary status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: savedJobs.length,
      data: savedJobs.map(mapSavedJob),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    const existingSavedJob = await SavedJob.findOne({
      candidate: req.user._id,
      job: job._id,
    });

    if (existingSavedJob) {
      return res.status(400).json({
        success: false,
        message: "Job is already saved.",
      });
    }

    const savedJob = await SavedJob.create({
      candidate: req.user._id,
      job: job._id,
    });

    const populatedSavedJob = await SavedJob.findById(savedJob._id).populate(
      "job",
      "title companyName location type category salary status"
    );

    res.status(201).json({
      success: true,
      message: "Job saved successfully.",
      data: mapSavedJob(populatedSavedJob),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      _id: req.params.id,
      candidate: req.user._id,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found.",
      });
    }

    await SavedJob.findByIdAndDelete(savedJob._id);

    res.status(200).json({
      success: true,
      message: "Saved job removed successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadCv,
  getSavedJobs,
  saveJob,
  deleteSavedJob,
};