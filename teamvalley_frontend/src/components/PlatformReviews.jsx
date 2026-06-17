import React, { useCallback, useEffect, useState } from "react";
import InlineMessage from "./InlineMessage";
import { useInlineMessage } from "../hooks/useInlineMessage";

const REVIEWS_API_URL = "http://localhost:5000/api/reviews";

function PlatformReviews() {
  const loggedUser = JSON.parse(localStorage.getItem("jobvalleyUser"));
  const { message, showMessage } = useInlineMessage();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [reviewData, setReviewData] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
    reviews: [],
  });

  const [formData, setFormData] = useState({
    name:
      loggedUser?.companyName ||
      `${loggedUser?.firstName || ""} ${loggedUser?.lastName || ""}`.trim() ||
      "",
    role: loggedUser?.role || "guest",
    rating: 5,
    comment: "",
  });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(REVIEWS_API_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not load reviews.", "error");
        setLoading(false);
        return;
      }

      setReviewData(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  }, [showMessage]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingClick = (ratingValue) => {
    setFormData({
      ...formData,
      rating: ratingValue,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (formData.name.trim() === "" || formData.comment.trim() === "") {
      showMessage("Please fill your name and review comment.", "warning");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(REVIEWS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          rating: formData.rating,
          comment: formData.comment,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not submit review.", "error");
        setSubmitting(false);
        return;
      }

      setFormData({
        ...formData,
        rating: 5,
        comment: "",
      });

      setSubmitting(false);
      showMessage("Review submitted successfully.", "success");
      fetchReviews();
    } catch (error) {
      setSubmitting(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);

    return Array.from({ length: 5 }).map((_, index) => (
      <span key={index}>{index < roundedRating ? "★" : "☆"}</span>
    ));
  };

  return (
    <section className="review-banner platform-review-section fade-up">
      <div className="review-rating-box">
        <div className="review-stars">
          {renderStars(reviewData.averageRating)}
        </div>

        <h2>
          {loading
            ? "..."
            : reviewData.averageRating > 0
            ? `${reviewData.averageRating}/5`
            : "0/5"}
        </h2>

        <p>{reviewData.totalReviews} real platform reviews</p>
      </div>

      <div className="review-content">
        <span>STAR RATE REVIEW</span>
        <h2>Rate your experience with JobValley</h2>
        <p>
          Reviews are saved in MongoDB and the average rating is calculated from
          real user feedback.
        </p>

        <InlineMessage message={message} />

        <form className="platform-review-form" onSubmit={handleSubmitReview}>
          <div className="platform-rating-buttons">
            {[1, 2, 3, 4, 5].map((ratingValue) => (
              <button
                key={ratingValue}
                type="button"
                className={
                  formData.rating >= ratingValue ? "active-rating-star" : ""
                }
                onClick={() => handleRatingClick(ratingValue)}
              >
                ★
              </button>
            ))}
          </div>

          <div className="platform-review-grid">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />

            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="guest">Guest</option>
              <option value="candidate">Candidate</option>
              <option value="company">Company</option>
            </select>
          </div>

          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Write your review about the platform..."
          ></textarea>

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      <div className="review-small-stats platform-review-list">
        <h3>Latest Reviews</h3>

        {reviewData.reviews.length === 0 ? (
          <div className="platform-empty-review">
            <strong>No reviews yet</strong>
            <span>Be the first to rate JobValley</span>
          </div>
        ) : (
          reviewData.reviews.slice(0, 3).map((review) => (
            <div className="platform-review-item" key={review._id}>
              <div className="platform-review-item-top">
                <strong>{review.name}</strong>
                <span>{review.rating}/5 ★</span>
              </div>

              <p>{review.comment}</p>

              <small>{review.role}</small>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default PlatformReviews;