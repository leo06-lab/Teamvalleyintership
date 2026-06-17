const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const {
  register,
  login,
  registerCandidate,
  registerCompany,
  checkEmail,
  loginUser,
  getMe,
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login); 

router.post("/register/candidate", registerCandidate);

router.post("/register/company", registerCompany);

router.post("/check-email", checkEmail);

router.post("/login", loginUser); 

router.get("/me", protect, getMe);

module.exports = router;
