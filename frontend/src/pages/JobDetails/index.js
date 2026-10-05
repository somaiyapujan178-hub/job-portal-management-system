import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const JobDetails = ({ user }) => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({
    applicantName: user?.name || "",
    applicantEmail: user?.email || "",
    applicantPhone: "",
    headline: "",
    applicantSkills: [],
  });
  const [applicationStatus, setApplicationStatus] = useState("");
  const [applying, setApplying] = useState(false);
  const [selectedRequiredSkills, setSelectedRequiredSkills] = useState([]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${API}/api/jobs/${id}`);
        if (!response.ok) throw new Error("Job not found");
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error(error);
        setApplicationStatus("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  const requiredSkills = job?.skills || [];
  const matchPercentage = requiredSkills.length > 0
    ? (selectedRequiredSkills.length / requiredSkills.length) * 100
    : 100;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applicationData.applicantName || !applicationData.applicantEmail) {
      setApplicationStatus("Please fill in your name and email");
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

      const response = await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: id,
          applicantName: applicationData.applicantName,
          applicantEmail: applicationData.applicantEmail,
          applicantPhone: applicationData.applicantPhone,
          headline: applicationData.headline,
          applicantSkills: combinedSkills,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit application");
      const data = await response.json();
      setApplicationStatus(`✅ Applied successfully! Match Score: ${data.matchScore || 0}%`);
      setApplicationData({
        applicantName: user?.name || "",
        applicantEmail: user?.email || "",
        applicantPhone: "",
        headline: "",
        applicantSkills: [],
      });
      setSelectedRequiredSkills([]);
    } catch (error) {
      setApplicationStatus("❌ Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page-container"><p>Loading job details...</p></div>;
  if (!job) return <div className="page-container"><p>Job not found</p><Link className="btn btn-secondary" to="/jobs">Back to jobs</Link></div>;

  return (
    <div className="page-container">
      <Link className="btn btn-secondary" to="/jobs" style={{ marginBottom: "1rem" }}>← Back to jobs</Link>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>{job.title}</h2>
        <p className="eyebrow">{job.company} • {job.location}</p>
        <p style={{ fontSize: "1.1rem", color: "var(--primary-light)", fontWeight: "600" }}>{job.salary}</p>
        <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>{job.description}</p>

        {job.skills?.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <strong>Required Skills:</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
              {job.skills.map((skill) => (
                <span key={skill} className="tag-badge" style={{ background: "rgba(59,130,246,0.15)", borderColor: "rgba(96,165,250,0.3)" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Apply for this job</h3>
        <form onSubmit={handleApply} style={{ display: "grid", gap: "1rem" }}>
          <label>
            <strong>Your Name</strong>
            <input
              type="text"
              name="applicantName"
              value={applicationData.applicantName}
              onChange={handleInputChange}
              placeholder="Full name"
              required
            />
          </label>

          <label>
            <strong>Email</strong>
            <input
              type="email"
              name="applicantEmail"
              value={applicationData.applicantEmail}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
            />
          </label>

          <label>
            <strong>Phone (Optional)</strong>
            <input
              type="tel"
              name="applicantPhone"
              value={applicationData.applicantPhone}
              onChange={handleInputChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </label>

          <label>
            <strong>Headline/Title (Optional)</strong>
            <input
              type="text"
              name="headline"
              value={applicationData.headline}
              onChange={handleInputChange}
              placeholder="e.g. Full Stack Developer with 3+ years experience"
            />
          </label>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
            <strong style={{ display: "block", marginBottom: "0.75rem" }}>🎯 Your Skills</strong>

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
            type="submit"
            className="btn btn-primary"
            disabled={applying || (requiredSkills.length > 0 && matchPercentage < 75)}
            style={{ marginTop: "1rem", opacity: (requiredSkills.length > 0 && matchPercentage < 75) ? 0.5 : 1 }}
          >
            {applying ? "Submitting..." : "Submit Application"}
          </button>

          {applicationStatus && (
            <p style={{ color: applicationStatus.includes("✅") ? "#10B981" : "#FF6B6B" }}>
              {applicationStatus}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default JobDetails;
