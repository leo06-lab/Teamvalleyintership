const express = require("express");
const router = express.Router();

// Importimi i funksionit nga contactController
const { createContactMessage } = require("../controllers/contactController");

// Route per te krijuar nje mesazh kontakti 
router.post("/", createContactMessage);

module.exports = router;