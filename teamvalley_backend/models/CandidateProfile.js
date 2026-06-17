const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    about: { type: String, default: "" },
    skills: [{ type: String }],
    education: { type: String, default: "" },
    experience: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    cvUrl: { type: String, default: "" },
    cvFileName: { type: String, default: "" },
    cvUploadedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CandidateProfile", candidateProfileSchema);
