const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    jobId: { type: Number, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedJob", savedJobSchema);