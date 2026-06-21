const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");

const {
  getAdminDashboard,
  getAdminUsers,
  deleteAdminUser,
  getAdminJobs,
  updateAdminJobStatus,
  deleteAdminJob,
  getAdminApplications,
  updateAdminApplicationStatus,
  getAdminReviews,
  getAdminContactMessages,
  deleteAdminContactMessage,
  deleteAdminReview,
} = require("../controllers/adminController");

router.get("/dashboard", protect, allowRoles("admin"), getAdminDashboard);

router.get("/users", protect, allowRoles("admin"), getAdminUsers);
router.delete("/users/:id", protect, allowRoles("admin"), deleteAdminUser);

router.get("/jobs", protect, allowRoles("admin"), getAdminJobs);
router.put(
  "/jobs/:id/status",
  protect,
  allowRoles("admin"),
  updateAdminJobStatus
);
router.delete("/jobs/:id", protect, allowRoles("admin"), deleteAdminJob);

router.get(
  "/applications",
  protect,
  allowRoles("admin"),
  getAdminApplications
);
router.put(
  "/applications/:id/status",
  protect,
  allowRoles("admin"),
  updateAdminApplicationStatus
);

router.get("/reviews", protect, allowRoles("admin"), getAdminReviews);
router.get(
  "/contact-messages",
  protect,
  allowRoles("admin"),
  getAdminContactMessages
);
router.delete(
  "/contact-messages/:id",
  protect,
  allowRoles("admin"),
  deleteAdminContactMessage
);
router.delete("/reviews/:id", protect, allowRoles("admin"), deleteAdminReview);

module.exports = router;