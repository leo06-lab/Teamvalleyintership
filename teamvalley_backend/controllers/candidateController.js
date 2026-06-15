const CandidateProfile = require("../models/CandidateProfile");

// Controller per te menaxhuar profilet e kandidatit
//Funksioni per te marre profilin e kandidatit
const getProfile = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne();

    if (!profile) {
      profile = await CandidateProfile.create({
        fullName: "",
        email: "",
        phone: "",
        address: "",
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
      {},
      {
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
      {},
      {
        cvUrl: `/uploads/${req.file.filename}`,
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

module.exports = {
  getProfile,
  updateProfile,
  uploadCv,
};