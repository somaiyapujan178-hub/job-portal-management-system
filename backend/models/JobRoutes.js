const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  salary: { type: String, default: "Negotiable" },
  type: { type: String, default: "Full Time" },
  description: { type: String, default: "" },
  facilities: { type: [String], default: [] },
  skills: { type: [String], default: [] },       // Required skills for this job
  postedBy: { type: String, default: "Admin" },
  postedById: { type: String, default: "" },     // Recruiter's user ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
