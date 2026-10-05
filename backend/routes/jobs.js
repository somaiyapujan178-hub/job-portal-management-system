const express = require("express");
const Job = require("../models/JobRoutes");

const router = express.Router();

/* ─── GET /api/jobs ──────────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load jobs." });
  }
});

/* ─── GET /api/jobs/:id ──────────────────────────────────────── */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load job." });
  }
});

/* ─── POST /api/jobs ─────────────────────────────────────────── */
router.post("/", async (req, res) => {
  const { title, company, location, salary, type, description, postedBy, postedById, skills, facilities } = req.body;

  if (!title || !company || !location) {
    return res.status(400).json({ message: "Title, company, and location are required." });
  }

  try {
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      type,
      description,
      postedBy,
      postedById,
      skills: Array.isArray(skills) ? skills : [],
      facilities: Array.isArray(facilities) ? facilities : [],
    });
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create job." });
  }
});

/* ─── PUT /api/jobs/:id ──────────────────────────────────────── */
router.put("/:id", async (req, res) => {
  const { title, company, location, salary, type, description, postedBy, postedById, skills, facilities } = req.body;

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.type = type || job.type;
    job.description = description || job.description;
    job.postedBy = postedBy || job.postedBy;
    if (postedById !== undefined) job.postedById = postedById;
    if (skills !== undefined) job.skills = Array.isArray(skills) ? skills : job.skills;
    if (facilities !== undefined) job.facilities = Array.isArray(facilities) ? facilities : job.facilities;

    await job.save();

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update job." });
  }
});

/* ─── DELETE /api/jobs/:id ───────────────────────────────────── */
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });

    res.json({ message: "Job removed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to delete job." });
  }
});

module.exports = router;
