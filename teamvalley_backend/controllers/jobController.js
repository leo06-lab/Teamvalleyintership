const SavedJob = require("../models/Job");

// Funksioni per te ruajtur nje pune te preferuar
const saveJob = async (req, res) => {
  try {
    const { jobId, jobTitle, company, location } = req.body;

    const alreadySaved = await SavedJob.findOne({ jobId });

    if (alreadySaved) {
      return res.status(400).json({ message: "Puna është tashmë e ruajtur" });
    }

    const savedJob = await SavedJob.create({
      jobId,
      jobTitle,
      company,
      location,
    });

    res.status(201).json({
      message: "Puna u ruajt me sukses",
      savedJob,
    });
  } catch (error) {
    res.status(500).json({ message: "Gabim në server", error: error.message });
  }
};

// Funksioni per te marre listen e puneve te preferuara te kandidatit
const getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find().sort({ createdAt: -1 });
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Gabim në server", error: error.message });
  }
};

// Funksioni per te fshire nje pune te preferuar nga lista e kandidatit
const deleteSavedJob = async (req, res) => {
  try {
    await SavedJob.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Puna u hoq me sukses" });
  } catch (error) {
    res.status(500).json({ message: "Gabim në server", error: error.message });
  }
};

module.exports = {
  saveJob,
  getMySavedJobs,
  deleteSavedJob,
};