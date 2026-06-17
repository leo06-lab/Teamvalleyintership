const express = require("express");
const router = express.Router();

const {
  createReview,
  getPlatformReviews,
} = require("../controllers/reviewController");

router.get("/", getPlatformReviews);
router.post("/", createReview);

module.exports = router;