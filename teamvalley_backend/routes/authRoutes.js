const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const {
  registerCandidate,
  registerCompany,
  checkEmail,
  loginUser,
  getMe,
} = require("../controllers/authController");

router.post("/register/candidate", registerCandidate);

router.post("/register/company", registerCompany);

router.post("/check-email", checkEmail);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

module.exports = router;