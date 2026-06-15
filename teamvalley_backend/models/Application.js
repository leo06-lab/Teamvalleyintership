const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
{
  jobId: {
    type: Number,
    required: true,
  },

  jobTitle: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    default: "",
  },

  candidateName: {
    type: String,
    required: true,
  },

  candidateEmail: {
    type: String,
    required: true,
  },

  candidatePhone: {
    type: String,
    default: "",
  },
  
  candidateAddress: {
    type: String,
    default: "",
  },

  candidateAbout: {
    type: String,
    default: "",
  },

  candidateSkills: [{
    type: String,
  }],

  candidateEducation: {
    type: String,
    default: "",
  },

  candidateExperience: {
    type: String,
    default: "",
  },

  candidateGithub: {
    type: String,
    default: "",
  },

  candidateLinkedin: {
    type: String,
    default: "",
  }, 
  cvUrl: {
    type: String,
    default: "",
  },
  cvFileName: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Interview",
      "Accepted",
      "Rejected",
    ],
    default: "Pending",
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Application", applicationSchema);