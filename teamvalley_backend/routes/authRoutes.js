const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.use(express.json());

// post route per regjistrimin
router.post("/register", register); 
// post route per login
router.post("/login", login);

module.exports = router;
