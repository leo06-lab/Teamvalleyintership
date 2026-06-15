const Application = require("../models/Application");
const CandidateProfile = require("../models/CandidateProfile");

// Aplikim per nje pune nga kandidati, duke marre te dhenat e profilit dhe te punes dhe duke krijuar nje aplikim te ri ne database
const applyForJob = async (req, res) => {
  try {
    const { jobId, jobTitle, company, location } = req.body;

    const profile = await CandidateProfile.findOne();

    if (!profile) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const alreadyApplied = await Application.findOne({
      jobId,
      candidateEmail: profile.email,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Ju keni aplikuar tashmë për këtë punë" });
    }

    const application = await Application.create({
      jobId,
      jobTitle,
      company,
      location,
      candidateName: profile.fullName,
      candidateEmail: profile.email,
      candidatePhone: profile.phone,
      candidateAddress: profile.address,
      candidateAbout: profile.about,
      candidateSkills: profile.skills,
      candidateEducation: profile.education,
      candidateExperience: profile.experience,
      candidateGithub: profile.github,
      candidateLinkedin: profile.linkedin,
      cvUrl: profile.cvUrl || "",
      cvFileName: profile.cvFileName || "",
      status: "Pending",
    });

    res.status(201).json({
      message: "Aplikimi u dërgua me sukses",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: "Gabim në server", error: error.message });
  }
};

// Merr te gjitha aplikimet e kandidatit aktual nga database 
const getMyApplications = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne();

    if (!profile) {
      return res.json([]);
    }

    const applications = await Application.find({
      candidateEmail: profile.email,
    }).sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Gabim në server", error: error.message });
  }
};

// Permirson statusin e nje aplikimi te caktuar nga "Pending" ne "Accepted" ose "Rejected" dhe kthen aplikimin e perditesuar ne response
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Gabim në server", error: error.message });
  }
};

// Fshin nje aplikim te caktuar nga database 
const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Aplikimi u hoq me sukses",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gabim në server",
      error: error.message,
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
};