const express = require("express");
const router = express.Router();

// Importimi i controller
const {
  saveJob,
  getMySavedJobs,
  deleteSavedJob,
} = require("../controllers/jobController");

// Ruterat per menaxhimin e punëve të preferuara të kandidatit
router.post("/saved-jobs", saveJob);
router.get("/saved-jobs", getMySavedJobs);
router.delete("/saved-jobs/:id", deleteSavedJob);

module.exports = router;