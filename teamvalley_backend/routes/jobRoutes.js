const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");

const {
  createJob,
  getJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

router.get("/", getJobs);

router.get(
  "/company/my-jobs",
  protect,
  allowRoles("company"),
  getCompanyJobs
);

router.post("/", protect, allowRoles("company"), createJob);

router.get("/:id", getJobById);

router.put("/:id", protect, allowRoles("company"), updateJob);

router.delete("/:id", protect, allowRoles("company"), deleteJob);

module.exports = router;