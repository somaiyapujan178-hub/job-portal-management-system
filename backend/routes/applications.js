const express = require("express");
const Application = require("../models/ApplicationRoutes");
const Job = require("../models/JobRoutes");

const router = express.Router();

/* ─── Skill Match Utility ─────────────────────────────────────── */
function computeMatchScore(requiredSkills = [], applicantSkills = []) {
  // Ensure both are arrays
  const required = Array.isArray(requiredSkills) ? requiredSkills : [];
  const applicant = Array.isArray(applicantSkills) ? applicantSkills : [];

  if (!required.length) return 100; // no requirements = open to all
  
  // Normalize: lowercase and trim all skills, filter empty strings
  const normalizedRequired = required
    .map((s) => (s || "").toLowerCase().trim())
    .filter((s) => s.length > 0);
  
  const normalizedApplicant = applicant
    .map((s) => (s || "").toLowerCase().trim())
    .filter((s) => s.length > 0);

  if (!normalizedRequired.length) return 100; // no requirements = open to all
  if (!normalizedApplicant.length) return 0; // no skills provided = no match

  // Count matches
  const matched = normalizedRequired.filter((s) => normalizedApplicant.includes(s));
  const score = Math.round((matched.length / normalizedRequired.length) * 100);
  
  return score;
}

/* ─── GET /api/applications ──────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ matchScore: -1, createdAt: -1 })
      .populate("job");
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load applications." });
  }
});

/* ─── GET /api/applications/by-job/:jobId ────────────────────── */
// Returns applicants for a specific job, filtered by minScore (default 80)
router.get("/by-job/:jobId", async (req, res) => {
  const minScore = parseInt(req.query.minScore, 10);
  const threshold = isNaN(minScore) ? 80 : minScore;

  try {
    const applications = await Application.find({ job: req.params.jobId })
      .sort({ matchScore: -1, createdAt: -1 })
      .populate("job");

    const filtered = applications.filter((a) => a.matchScore >= threshold);
    res.json({
      total: applications.length,
      filtered: filtered.length,
      threshold,
      applications: filtered,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load applications." });
  }
});

/* ─── POST /api/applications ─────────────────────────────────── */
router.post("/", async (req, res) => {
  const { job, applicantName, applicantEmail, applicantPhone, headline, summary, linkedinUrl, experience, education, message, resumeUrl, applicantSkills } = req.body;

  if (!job || !applicantName || !applicantEmail) {
    return res.status(400).json({ message: "Job, applicant name, and applicant email are required." });
  }

  try {
    const jobRecord = await Job.findById(job);
    if (!jobRecord) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Compute skill match score
    const skillsArray = Array.isArray(applicantSkills)
      ? applicantSkills.filter((s) => (s || "").trim().length > 0).map((s) => s.trim())
      : (applicantSkills || "").split(",").map((s) => s.trim()).filter(Boolean);

    const matchScore = computeMatchScore(jobRecord.skills || [], skillsArray);

    const application = await Application.create({
      job,
      applicantName,
      applicantEmail,
      applicantPhone: applicantPhone || "",
      headline: headline || "",
      summary: summary || message || "",
      linkedinUrl: linkedinUrl || "",
      experience: Array.isArray(experience) ? experience : [],
      education: Array.isArray(education) ? education : [],
      message: message || "",
      resumeUrl: resumeUrl || "",
      applicantSkills: skillsArray,
      matchScore,
    });

    res.status(201).json({ ...application.toObject(), matchScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to submit application." });
  }
});

/* ─── PUT /api/applications/:id ─────────────────────────────── */
router.put("/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }
    application.status = status || application.status;
    await application.save();
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update application." });
  }
});

module.exports = router;
