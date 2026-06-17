const express = require("express");
const router = express.Router();

// Importimi i middleware dhe controller
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const upload = require("../middleware/upload");
const {
  getProfile,
  updateProfile,
  uploadCv,
  getSavedJobs,
  saveJob,
  deleteSavedJob,
} = require("../controllers/candidateController");

// Ruterat per menaxhimin e profileve te kandidatit
router.get("/profile", protect, allowRoles("candidate"), getProfile);
router.put("/profile", protect, allowRoles("candidate"), updateProfile);
router.post(
  "/profile/cv",
  protect,
  allowRoles("candidate"),
  upload.single("cv"),
  uploadCv
);
router.get("/saved-jobs", protect, allowRoles("candidate"), getSavedJobs);
router.post("/saved-jobs/:jobId", protect, allowRoles("candidate"), saveJob);
router.delete("/saved-jobs/:id", protect, allowRoles("candidate"), deleteSavedJob);

module.exports = router;