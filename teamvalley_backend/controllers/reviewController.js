const Review = require("../models/Review");

const createReview = async (req, res) => {
  try {
    const { name, role, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please fill name, rating and comment.",
      });
    }

    const ratingNumber = Number(rating);

    if (ratingNumber < 1 || ratingNumber > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const review = await Review.create({
      name,
      role: role || "guest",
      rating: ratingNumber,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
    });
  } catch (error) {
    console.log("Create review error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not submit review.",
    });
  }
};

const getPlatformReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(6);

    const allReviews = await Review.find();

    const totalReviews = allReviews.length;

    const ratingSum = allReviews.reduce((sum, review) => {
      return sum + review.rating;
    }, 0);

    const averageRating =
      totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(1)) : 0;

    const ratingCounts = {
      5: allReviews.filter((review) => review.rating === 5).length,
      4: allReviews.filter((review) => review.rating === 4).length,
      3: allReviews.filter((review) => review.rating === 3).length,
      2: allReviews.filter((review) => review.rating === 2).length,
      1: allReviews.filter((review) => review.rating === 1).length,
    };

    res.status(200).json({
      success: true,
      data: {
        averageRating,
        totalReviews,
        ratingCounts,
        reviews,
      },
    });
  } catch (error) {
    console.log("Get reviews error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load reviews.",
    });
  }
};

module.exports = {
  createReview,
  getPlatformReviews,
};