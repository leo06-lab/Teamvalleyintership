const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const upload = require("../middleware/upload");

const {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyDashboard,
  getCompanyAnalytics,
  updateCompanyLogo,
  removeCompanyLogo,
} = require("../controllers/companyController");

router.get("/profile", protect, allowRoles("company"), getCompanyProfile);

router.put("/profile", protect, allowRoles("company"), updateCompanyProfile);

router.put(
  "/profile/logo",
  protect,
  allowRoles("company"),
  upload.single("logo"),
  updateCompanyLogo
);

router.delete(
  "/profile/logo",
  protect,
  allowRoles("company"),
  removeCompanyLogo
);

router.get("/dashboard", protect, allowRoles("company"), getCompanyDashboard);

router.get("/analytics", protect, allowRoles("company"), getCompanyAnalytics);

module.exports = router;