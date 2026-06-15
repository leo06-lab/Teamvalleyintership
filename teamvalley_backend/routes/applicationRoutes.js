const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");

const {
  applyForJob,
  getCompanyApplications,
  getApplicationById,
  getMyApplications,
  updateApplicationStatus,
  scheduleInterview,
  updateApplicationNotes,
} = require("../controllers/applicationController");

router.post(
  "/apply/:jobId",
  protect,
  allowRoles("candidate"),
  applyForJob
);

router.get(
  "/company",
  protect,
  allowRoles("company"),
  getCompanyApplications
);

router.get(
  "/my-applications",
  protect,
  allowRoles("candidate"),
  getMyApplications
);

router.get(
  "/:id",
  protect,
  allowRoles("company"),
  getApplicationById
);

router.put(
  "/:id/status",
  protect,
  allowRoles("company"),
  updateApplicationStatus
);

router.put(
  "/:id/interview",
  protect,
  allowRoles("company"),
  scheduleInterview
);

router.put(
  "/:id/notes",
  protect,
  allowRoles("company"),
  updateApplicationNotes
);

module.exports = router;