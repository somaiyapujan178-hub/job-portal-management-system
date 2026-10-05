const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantPhone: { type: String, default: "" },
  headline: { type: String, default: "" },
  summary: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  experience: { type: Array, default: [] },
  education: { type: Array, default: [] },
  message: { type: String, default: "" },
  resumeUrl: { type: String, default: "" },
  applicantSkills: { type: [String], default: [] },  // Skills provided by job seeker
  matchScore: { type: Number, default: 0 },           // % match against job required skills
  status: {
    type: String,
    enum: ["Submitted", "Reviewed", "Accepted", "Rejected"],
    default: "Submitted",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", applicationSchema);
