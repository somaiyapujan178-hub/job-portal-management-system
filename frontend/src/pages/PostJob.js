import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const COMMON_SKILLS = [
  "React", "Node.js", "MongoDB", "JavaScript", "Python", "Java", "SQL",
  "TypeScript", "AWS", "Docker", "Kubernetes", "Git", "HTML/CSS",
  "Express.js", "REST APIs", "GraphQL", "PostgreSQL", "Redis", "Linux",
  "Machine Learning", "Data Analysis", "Figma", "UI/UX", "Agile",
];

const PostJob = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full Time",
    description: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills,
          postedBy: user ? user.name : "Guest",
          postedById: user ? user._id : "",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Unable to post job.");
        setMsgType("error");
        return;
      }
      setMessage("✅ Job posted successfully! Redirecting to your dashboard...");
      setMsgType("success");
      setFormData({ title: "", company: "", location: "", salary: "", type: "Full Time", description: "" });
      setSkills([]);
      setTimeout(() => navigate("/recruiter"), 1500);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card form-card" style={{ maxWidth: "760px", margin: "0 auto" }}>
        <p className="eyebrow">Recruiter</p>
        <h2>➕ Post a New Job</h2>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
          Add required skills so our system can automatically match the best candidates (80%+ skill match).
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Job Title *
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Full Stack Developer" />
          </label>
          <label>
            Company *
            <input name="company" value={formData.company} onChange={handleChange} required placeholder="e.g. TechCorp Pvt. Ltd." />
          </label>
          <label>
            Location *
            <input name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Bangalore, Remote" />
          </label>
          <label>
            Salary
            <input name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. ₹8–12 LPA" />
          </label>
          <label>
            Job Type
            <select name="type" value={formData.type} onChange={handleChange}>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
          </label>
          <label>
            Job Description
            <textarea name="description" value={formData.description} onChange={handleChange} rows="5"
              placeholder="Describe the role, responsibilities, and requirements..." />
          </label>

          {/* ── REQUIRED SKILLS ── */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ marginBottom: "0.5rem", display: "block" }}>
              Required Skills <span style={{ color: "var(--highlight)" }}>*</span>
              <span style={{ color: "var(--muted)", fontWeight: "400", fontSize: "0.85rem", marginLeft: "0.5rem" }}>
                (Candidates with ≥80% match will be highlighted)
              </span>
            </label>

            {/* Skills input */}
            <div style={{
              display: "flex", gap: "0.5rem", flexWrap: "wrap",
              padding: "0.75rem", borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "0.75rem", minHeight: "52px", alignItems: "center"
            }}>
              {skills.map((skill) => (
                <span key={skill} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  padding: "0.3rem 0.65rem", borderRadius: "999px",
                  background: "linear-gradient(90deg, rgba(59,130,246,0.25), rgba(139,92,246,0.2))",
                  border: "1px solid rgba(96,165,250,0.3)", fontSize: "0.85rem", color: "var(--text)"
                }}>
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}
                    style={{ background: "none", border: "none", color: "var(--highlight)", cursor: "pointer", padding: 0, fontSize: "1rem", lineHeight: 1 }}>
                    ×
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                onBlur={() => skillInput.trim() && addSkill(skillInput)}
                placeholder={skills.length === 0 ? "Type a skill and press Enter or comma..." : "Add more..."}
                style={{
                  flex: 1, minWidth: "180px", border: "none", outline: "none",
                  background: "transparent", color: "var(--text)", fontSize: "0.95rem"
                }}
              />
            </div>

            {/* Quick-add common skills */}
            <div>
              <span style={{ color: "var(--muted)", fontSize: "0.8rem", marginRight: "0.5rem" }}>Quick add:</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
                {COMMON_SKILLS.filter((s) => !skills.includes(s)).slice(0, 12).map((s) => (
                  <button key={s} type="button" onClick={() => addSkill(s)}
                    style={{
                      padding: "0.25rem 0.6rem", borderRadius: "999px", fontSize: "0.78rem",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--muted-2)", cursor: "pointer", transition: "all 200ms"
                    }}
                    onMouseEnter={(e) => { e.target.style.background = "rgba(59,130,246,0.15)"; e.target.style.color = "var(--primary-light)"; }}
                    onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.color = "var(--muted-2)"; }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ gridColumn: "1 / -1", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Publishing..." : "🚀 Publish Job"}
          </button>
        </form>

        {message && (
          <p style={{ color: msgType === "success" ? "var(--accent-2)" : "var(--highlight)", marginTop: "1rem", fontWeight: 600 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default PostJob;
