import { useEffect, useState } from "react";

const defaultJobs = [
  {
    title: "Software Engineer",
    company: "Infosys Limited",
    logo: "",
    location: "Bengaluru, India",
    salary: "₹12L - ₹18L",
    type: "",
    description: "Build scalable web applications, collaborate with product teams, and deliver high-quality software features.",
    facilities: [
      "Health insurance coverage",
      "Employee stock option plan",
      "Learning & development programs",
      "Gym and wellness facilities",
    ],
  },
  {
    title: "Chemical Engineer",
    company: "Reliance Industries Limited",
    logo: "",
    location: "Mumbai, India",
    salary: "₹9L - ₹12L",
    type: "",
    description: "Design and optimize chemical processes, support plant operations, and improve materials production efficiency.",
    facilities: [
      "On-site laboratory facilities",
      "Safety training and certifications",
      "Process simulation tools",
      "Canteen and company transportation",
    ],
  },
  {
    title: "Mechanical Engineer",
    company: "Adani Enterprises Limited",
    logo: "",
    location: "Pune, India",
    salary: "₹8L - ₹11L",
    type: "",
    description: "Develop mechanical systems, perform CAD design, and support manufacturing improvements for aerospace products.",
    facilities: [
      "Advanced R&D workshop",
      "3D printing and prototyping lab",
      "Design software licenses",
      "Mentorship and career guidance",
    ],
  },
  {
    title: "Data Scientist",
    company: "Amazon.com, Inc.",
    logo: "",
    location: "Hyderabad, India",
    salary: "₹16L - ₹22L",
    type: "",
    description: "Analyze complex data sets, build predictive models, and deliver actionable insights for business growth.",
    facilities: [
      "Cloud computing credits",
      "Data visualization platforms",
      "Research and analytics lab",
      "Flexible work environment",
    ],
  },
  {
    title: "Product Manager",
    company: "Pulse Creative Solutions Private Limited",
    logo: "",
    location: "Noida, India",
    salary: "₹14L - ₹20L",
    type: "",
    description: "Lead product strategy, define roadmaps, and work with engineering teams to launch customer-focused solutions.",
    facilities: [
      "Customer research studio",
      "Cross-functional collaboration spaces",
      "Strategy and design workshops",
      "Leadership coaching sessions",
    ],
  },
  {
    title: "DevOps Engineer",
    company: "Nexa Solutions Private Limited",
    logo: "",
    location: "Gurgaon, India",
    salary: "₹11L - ₹17L",
    type: "",
    description: "Automate deployment pipelines, monitor infrastructure, and maintain reliable cloud systems.",
    facilities: [
      "CI/CD automation tools",
      "Cloud infrastructure credits",
      "24/7 operations support",
      "Automation and monitoring lab",
    ],
  },
  {
    title: "Civil Engineer",
    company: "BridgePoint Design Limited",
    logo: "",
    location: "Chennai, India",
    salary: "₹7L - ₹10L",
    type: "",
    description: "Plan infrastructure projects, develop structural designs, and collaborate with field teams to ensure safe builds.",
    facilities: [
      "Site visit and safety gear",
      "Project management software",
      "Design review rooms",
      "Field training support",
    ],
  },
  {
    title: "Marketing Manager",
    company: "BrightWave Labs LLC",
    logo: "",
    location: "Remote, India",
    salary: "₹8L - ₹12L",
    type: "",
    description: "Create campaign strategies, manage digital channels, and grow brand awareness through data-driven marketing.",
    facilities: [
      "Digital marketing suite",
      "Creative production studio",
      "Campaign analytics tools",
      "Brand partnership resources",
    ],
  },
  {
    title: "HR Coordinator",
    company: "ModoTech Inc.",
    logo: "",
    location: "Ahmedabad, India",
    salary: "₹5L - ₹8L",
    type: "",
    description: "Support recruitment, onboarding, and employee communications across a growing technology team.",
    facilities: [
      "Employee wellness programs",
      "Training and development rooms",
      "HR information systems access",
      "Engagement and event support",
    ],
  },
  {
    title: "Finance Analyst",
    company: "SecureNet Corporation",
    logo: "",
    location: "Kolkata, India",
    salary: "₹9L - ₹13L",
    type: "",
    description: "Build financial models, track business performance, and help guide strategic planning decisions.",
    facilities: [
      "Financial modeling tools",
      "Budget planning software",
      "Stakeholder review sessions",
      "Professional development resources",
    ],
  },
];

const enrichJob = (job) => ({
  ...job,
  experience: job.experience || "2+ years",
  education: job.education || "Bachelor's degree",
  skillsRequired: job.skillsRequired?.length ? job.skillsRequired : ["Communication", "Teamwork", "Problem Solving"],
  responsibilities: job.responsibilities?.length
    ? job.responsibilities
    : ["Collaborate with cross-functional teams", "Support project delivery and quality"],
  benefits: job.benefits?.length ? job.benefits : (job.facilities?.length ? job.facilities : ["Learning support", "Health benefits"]),
});

const Jobs = ({ user }) => {
  const [jobs, setJobs] = useState(defaultJobs.map(enrichJob));
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    applicantName: user?.name || "",
    applicantEmail: user?.email || "",
    resumeUrl: "",
    message: "",
    applicantSkills: [],
  });
  const [applicationStatus, setApplicationStatus] = useState("");
  const [selectedRequiredSkills, setSelectedRequiredSkills] = useState([]);
  const [applying, setApplying] = useState(false);

  const handleJobSelect = (job) => {
    setSelectedJob(enrichJob(job));
    setApplicationStatus("");
    setSelectedRequiredSkills([]);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setApplicationStatus("");
    setSelectedRequiredSkills([]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setApplicationData((current) => ({ ...current, [name]: value }));
  };

  const addSkill = () => {
    setApplicationData((current) => ({
      ...current,
      applicantSkills: [...current.applicantSkills, ""],
    }));
  };

  const removeSkill = (index) => {
    setApplicationData((current) => ({
      ...current,
      applicantSkills: current.applicantSkills.filter((_, i) => i !== index),
    }));
  };

  const updateSkill = (index, value) => {
    setApplicationData((current) => ({
      ...current,
      applicantSkills: current.applicantSkills.map((skill, i) =>
        i === index ? value : skill
      ),
    }));
  };

  const handleResumeChange = (event) => {
    const file = event.target.files[0];
    setApplicationData((current) => ({
      ...current,
      resumeUrl: file ? file.name : "",
    }));
  };

  const requiredSkills = selectedJob?.skillsRequired || [];
  const matchPercentage = requiredSkills.length > 0
    ? (selectedRequiredSkills.length / requiredSkills.length) * 100
    : 100;

  const handleApply = async (job) => {
    if (!applicationData.applicantName || !applicationData.applicantEmail) {
      setApplicationStatus("Name and email are required to apply.");
      return;
    }

    if (!job._id) {
      setApplicationStatus("Resume apply is available only for jobs loaded from the backend.");
      return;
    }

    if (requiredSkills.length > 0 && matchPercentage < 75) {
      setApplicationStatus(`❌ Submission blocked: You must match at least 75% of the required skills. Current: ${Math.round(matchPercentage)}%`);
      return;
    }

    setApplying(true);
    try {
      const combinedSkills = Array.from(
        new Set([
          ...selectedRequiredSkills,
          ...applicationData.applicantSkills.filter((s) => s.trim() !== ""),
        ])
      );

      const response = await fetch(`${process.env.REACT_APP_API_URL || ""}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job: job._id,
          applicantName: applicationData.applicantName,
          applicantEmail: applicationData.applicantEmail,
          message: applicationData.message,
          resumeUrl: applicationData.resumeUrl,
          applicantSkills: combinedSkills,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Unable to submit application.");
      }

      setApplicationStatus("Application submitted successfully.");
      setApplicationData({
        applicantName: user?.name || "",
        applicantEmail: user?.email || "",
        resumeUrl: "",
        message: "",
        applicantSkills: [],
      });
      setSelectedRequiredSkills([]);
    } catch (error) {
      console.error(error);
      setApplicationStatus(error.message || "Unable to submit application.");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || ""}/api/jobs`);
        if (!response.ok) throw new Error("Job fetch failed");
        const data = await response.json();
        setJobs(data.length ? data.map(enrichJob) : defaultJobs.map(enrichJob));
      } catch (error) {
        console.error(error);
        setJobs(defaultJobs.map(enrichJob));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(query.toLowerCase()) ||
    job.company.toLowerCase().includes(query.toLowerCase()) ||
    job.location.toLowerCase().includes(query.toLowerCase())
  );

  const displayedJobs = filteredJobs.slice(0, 4);

  return (
    <div className="page-container">
      <div className="section-heading">
        <h2>Open Jobs</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, company, or location"
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <>
          <div className="job-grid">
            {displayedJobs.map((job, index) => {
              const jobId = job._id || `${job.title}-${index}`;
              const displaySkills = job.skillsRequired.slice(0, 4);

              return (
                <div
                  key={jobId}
                  className="job-card"
                  onClick={() => handleJobSelect(job)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => event.key === "Enter" && handleJobSelect(job)}
                >
                  <div className="job-card-top">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {job.logo ? (
                        <img src={job.logo} alt={`${job.company} logo`} className="company-logo" />
                      ) : (
                        <div className="company-logo" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(90deg,#1e3a8a,#7c3aed)", color: "#fff", fontWeight: 700 }}>
                          {job.company.split(" ").slice(0, 2).map((s) => s[0]).join("")}
                        </div>
                      )}
                      <div>
                        <div className="job-company">{job.company}</div>
                        <div className="job-role">{job.title}</div>
                      </div>
                    </div>
                    {job.type && (
                      <span className={`tag-badge ${["tag-blue", "tag-pink", "tag-mint"][index % 3]}`}>{job.type || "Job"}</span>
                    )}
                  </div>

                  <p className="job-card-description">{job.description}</p>

                  <div className="job-card-meta-grid">
                    <div>
                      <strong>Salary</strong>
                      <span>{job.salary}</span>
                    </div>
                    <div>
                      <strong>Experience</strong>
                      <span>{job.experience}</span>
                    </div>
                    <div>
                      <strong>Education</strong>
                      <span>{job.education}</span>
                    </div>
                  </div>

                  <div className="job-card-skills">
                    {displaySkills.map((skill, skillIndex) => (
                      <span key={`${jobId}-${skillIndex}`} className="tag-badge tag-mint">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="job-card-bullets">
                    <div>
                      <strong>Responsibilities</strong>
                      <ul>
                        {job.responsibilities.slice(0, 2).map((item, itemIndex) => (
                          <li key={`${jobId}-resp-${itemIndex}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Benefits</strong>
                      <ul>
                        {job.benefits.slice(0, 2).map((item, itemIndex) => (
                          <li key={`${jobId}-benefit-${itemIndex}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="job-card-actions">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleJobSelect(job);
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
            {displayedJobs.length === 0 && <p>No jobs found.</p>}
          </div>

          {selectedJob && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>&times;</button>
                <div className="modal-icon">💼</div>
                <h2>{selectedJob.title}</h2>
                <p className="job-company">{selectedJob.company}</p>
                <div className="job-metadata">
                  <span>{selectedJob.location}</span>
                  <span>{selectedJob.salary}</span>
                </div>

                <div className="job-detail-block">
                  <h4>Job Description</h4>
                  <p>{selectedJob.description}</p>
                </div>

                <div className="job-detail-grid">
                  <div className="job-detail-card">
                    <h4>Salary</h4>
                    <p>{selectedJob.salary}</p>
                  </div>
                  <div className="job-detail-card">
                    <h4>Experience</h4>
                    <p>{selectedJob.experience}</p>
                  </div>
                  <div className="job-detail-card">
                    <h4>Education</h4>
                    <p>{selectedJob.education}</p>
                  </div>
                  <div className="job-detail-card">
                    <h4>Skills Required</h4>
                    <div className="job-card-skills">
                      {selectedJob.skillsRequired.map((skill, skillIndex) => (
                        <span key={`${selectedJob.title}-skill-${skillIndex}`} className="tag-badge tag-mint">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="job-detail-block">
                  <h4>Responsibilities</h4>
                  <ul className="job-facilities-list">
                    {selectedJob.responsibilities.map((responsibility, responsibilityIndex) => (
                      <li key={`${selectedJob.title}-responsibility-${responsibilityIndex}`}>{responsibility}</li>
                    ))}
                  </ul>
                </div>

                <div className="job-detail-block">
                  <h4>Benefits</h4>
                  <ul className="job-facilities-list">
                    {selectedJob.benefits.map((benefit, benefitIndex) => (
                      <li key={`${selectedJob.title}-benefit-${benefitIndex}`}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="job-apply-form">
                  <h4>Apply with Resume</h4>
                  <div className="form-grid">
                    <input
                      type="text"
                      name="applicantName"
                      value={applicationData.applicantName}
                      onChange={handleInputChange}
                      placeholder="Your name"
                    />
                    <input
                      type="email"
                      name="applicantEmail"
                      value={applicationData.applicantEmail}
                      onChange={handleInputChange}
                      placeholder="Your email"
                    />
                    <label className="file-input-label">
                      Upload Resume
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                      />
                    </label>
                    <textarea
                      name="message"
                      value={applicationData.message}
                      onChange={handleInputChange}
                      placeholder="Tell the company why you'd be a great fit"
                      rows={3}
                    />
                  </div>

                  {/* Skills Section */}
                  <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
                    <h4 style={{ marginBottom: "0.75rem" }}>🎯 Your Skills</h4>

                    {requiredSkills.length > 0 && (
                      <div style={{
                        marginBottom: "1.25rem",
                        padding: "1rem",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(255,255,255,0.08)"
                      }}>
                        <span style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", color: "var(--muted)", fontWeight: "600" }}>
                          Recruiter's Required Skills (Select all you possess - Min 75% required):
                        </span>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                          {requiredSkills.map((skill) => (
                            <label key={skill} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", userSelect: "none" }}>
                              <input
                                type="checkbox"
                                checked={selectedRequiredSkills.includes(skill)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRequiredSkills([...selectedRequiredSkills, skill]);
                                  } else {
                                    setSelectedRequiredSkills(selectedRequiredSkills.filter(s => s !== skill));
                                  }
                                }}
                                style={{ width: "16px", height: "16px", cursor: "pointer" }}
                              />
                              <span style={{ fontSize: "0.95rem", color: "var(--text)" }}>{skill}</span>
                            </label>
                          ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.5rem" }}>
                          <span>Match Status:</span>
                          <strong style={{ color: matchPercentage >= 75 ? "var(--accent-2)" : "var(--highlight)" }}>
                            {Math.round(matchPercentage)}% Matched
                          </strong>
                          <span>({selectedRequiredSkills.length} of {requiredSkills.length})</span>
                          {matchPercentage < 75 && (
                            <span style={{ color: "var(--highlight)", fontSize: "0.8rem", marginLeft: "auto" }}>
                              ⚠️ Need at least 75%
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <span style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--muted)", fontWeight: "600" }}>
                      {requiredSkills.length > 0 ? "Additional Skills (Optional):" : "Add Your Skills:"}
                    </span>
                    {applicationData.applicantSkills.map((skill, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", alignItems: "center" }}>
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkill(idx, e.target.value)}
                          placeholder="e.g. React, Python, AWS"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => removeSkill(idx)}
                          style={{ fontSize: "0.75rem", padding: "0.35rem 0.6rem", minWidth: "60px" }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addSkill}
                      style={{ fontSize: "0.85rem", padding: "0.5rem 0.75rem" }}
                    >
                      + Add Skill
                    </button>
                  </div>

                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => handleApply(selectedJob)}
                    disabled={applying || (requiredSkills.length > 0 && matchPercentage < 75)}
                    style={{ marginTop: "1.5rem", opacity: (requiredSkills.length > 0 && matchPercentage < 75) ? 0.5 : 1 }}
                  >
                    {applying ? "Submitting..." : "Submit Application"}
                  </button>
                  {applicationStatus && <p className="form-message" style={{ color: applicationStatus.includes("❌") ? "var(--highlight)" : "var(--accent-2)" }}>{applicationStatus}</p>}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;
