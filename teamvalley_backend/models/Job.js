const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: String,
      default: "Negotiable",
      trim: true,
    },

    deadline: {
      type: String,
      trim: true,
    },

    level: {
      type: String,
      default: "Junior / Mid",
      trim: true,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    applicants: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
