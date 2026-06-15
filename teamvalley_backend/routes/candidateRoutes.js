const express = require("express");
const router = express.Router();

// Importimi i middleware dhe controller
const upload = require("../middleware/uploadMiddleware");
const {
  getProfile,
  updateProfile,
  uploadCv,
} = require("../controllers/candidateController");

// Ruterat per menaxhimin e profileve te kandidatit
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/cv", upload.single("cv"), uploadCv);

module.exports = router;