const express = require("express");
const router = express.Router();

// Importimi i funksioneve nga applicationController per te trajtuar rruget e aplikimeve
const {
  applyForJob,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");

// Rruget per aplikimet
router.post("/applications", applyForJob);
router.get("/applications", getMyApplications);
router.put("/applications/:id/status", updateApplicationStatus);
router.delete("/applications/:id", deleteApplication);

module.exports = router;