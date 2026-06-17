const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    candidateName: {
      type: String,
      required: true,
      trim: true,
    },

    candidateEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    candidateCVUrl: {
      type: String,
      trim: true,
    },

    candidateCVFileName: {
      type: String,
      trim: true,
    },

    candidatePhone: {
      type: String,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    coverLetter: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "shortlisted", "interview", "rejected", "accepted"],
      default: "pending",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "shortlisted", "interview", "rejected", "accepted"],
          required: true,
        },

        changedAt: {
          type: Date,
          default: Date.now,
        },

        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        note: {
          type: String,
          trim: true,
        },
      },
    ],

    interviewDate: {
      type: String,
      trim: true,
    },

    interviewTime: {
      type: String,
      trim: true,
    },

    interviewMode: {
      type: String,
      enum: ["Online", "In Office", "Phone Call", ""],
      default: "",
    },

    interviewLocation: {
      type: String,
      trim: true,
    },

    interviewNote: {
      type: String,
      trim: true,
    },

    companyNote: {
      type: String,
      trim: true,
    },

    candidateRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
module.exports = mongoose.model("Application", applicationSchema);