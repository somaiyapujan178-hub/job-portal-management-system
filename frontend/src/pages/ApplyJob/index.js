import { useState, useEffect } from "react";

const sampleResume = {
  name: "Aarav Singh",
  title: "Software Engineer",
  summary:
    "Detail-oriented software engineer with 3+ years of experience building scalable web applications and cross-functional solutions.",
  experience: [
    {
      role: "Frontend Developer",
      company: "TechWave Solutions",
      period: "Jan 2022 - Present",
      details: [
        "Built responsive React applications with intuitive UX.",
        "Improved page load times by 35% through performance optimizations.",
      ],
    },
    {
      role: "Software Intern",
      company: "CloudCore Labs",
      period: "Jun 2021 - Dec 2021",
      details: [
        "Developed internal reporting tools using Node.js.",
        "Collaborated with product teams to deliver customer-facing features.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science",
      school: "Indian Institute of Technology",
      period: "2018 - 2022",
    },
  ],
  skills: ["React", "JavaScript", "Node.js", "REST APIs", "SQL", "Git"],
};

const bestResume = {
  name: "Pujan Somaiya",
  title: "Full Stack Developer",
  summary:
    "Passionate and detail-oriented Full Stack Developer with expertise in MongoDB, Express.js, React.js, and Node.js. Experienced in designing interactive UI/UX and building secure, scalable backends.",
  experience: [
    {
      role: "Full Stack Developer",
      company: "JobSphere Project",
      period: "Jul 2026 - Present",
      details: [
        "Architected and developed the JobSphere job portal using React, Node.js, and MongoDB.",
        "Implemented secure user authentication and interactive dashboards for job seekers.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering (4th Year)",
      school: "P P Savani University",
      period: "2023 - Present",
    },
  ],
  skills: ["MongoDB", "Express.js", "React.js", "Node.js", "JavaScript", "REST APIs", "Git", "HTML/CSS"],
};

const devopsResume = {
  name: "Rohan Mehta",
  title: "Cloud & DevOps Engineer",
  summary:
    "Automated infrastructure enthusiast and DevOps Engineer with 5+ years of experience specializing in AWS, Kubernetes, Terraform, and CI/CD pipeline automation.",
  experience: [
    {
      role: "Lead DevOps Engineer",
      company: "Apex Cloud Systems",
      period: "Aug 2022 - Present",
      details: [
        "Architected scalable infrastructure on AWS using Terraform, reducing deployment time by 50%.",
        "Migrated legacy monolithic applications to Kubernetes, improving system reliability to 99.99%.",
        "Implemented secure GitOps pipelines with ArgoCD and GitHub Actions.",
      ],
    },
    {
      role: "Cloud Infrastructure Engineer",
      company: "Symphony Software",
      period: "Nov 2019 - Jul 2022",
      details: [
        "Managed Dockerized deployments and automated routine server maintenance tasks.",
        "Set up centralized monitoring and logging using Prometheus, Grafana, and ELK stack.",
      ],
    },
  ],
  education: [
    {
      degree: "B.E. in Information Technology",
      school: "Pune Institute of Computer Technology",
      period: "2015 - 2019",
    },
  ],
  skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Python", "Prometheus", "Grafana", "Linux"],
};

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ApplyJob = ({ user, jobId }) => {
  const [message, setMessage] = useState("");
  const [resumeData, setResumeData] = useState({
    fullName: "Pujan Somaiya",
    email: "23SE02ML196@PPSU.AC.IN",
    phone: "+91 8401338599",
    resumeLink: "https://github.com/pujansomaiya",
    linkedinUrl: "https://www.linkedin.com/in/pujansomaiya",
    headline: "Full Stack Developer",
    summary: "Passionate and detail-oriented Full Stack Developer with expertise in MongoDB, Express.js, React.js, and Node.js. Experienced in designing interactive UI/UX and building secure, scalable backends.",
    experience: [
      {
        role: "Full Stack Developer",
        company: "JobSphere Project",
        period: "Jul 2026 - Present",
        details: [
          "Architected and developed the JobSphere job portal using React, Node.js, and MongoDB.",
          "Implemented secure user authentication and interactive dashboards for job seekers.",
        ],
      },
    ],
    education: [
      {
        degree: "B.Tech in Computer Science & Engineering (4th Year)",
        school: "P P Savani University",
        period: "2023 - Present",
      },
    ],
    skills: ["MongoDB", "Express.js", "React.js", "Node.js", "JavaScript", "REST APIs", "Git", "HTML/CSS"],
  });

  const [skillsText, setSkillsText] = useState("MongoDB, Express.js, React.js, Node.js, JavaScript, REST APIs, Git, HTML/CSS");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setResumeData((current) => ({ ...current, [name]: value }));
  };

  const handleSkillsChange = (event) => {
    const value = event.target.value;
    setSkillsText(value);
    const parsedSkills = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setResumeData((current) => ({ ...current, skills: parsedSkills }));
  };

  const loadSample = () => {
    setResumeData({
      fullName: sampleResume.name,
      email: "aarav.singh@email.com",
      phone: "+91 98765 43210",
      resumeLink: "https://example.com/resume/aarav-singh.pdf",
      headline: sampleResume.title,
      summary: sampleResume.summary,
      experience: sampleResume.experience,
      education: sampleResume.education,
      skills: sampleResume.skills,
    });
    setSkillsText(sampleResume.skills.join(", "));
    setMessage("Sample resume loaded. Edit the fields as needed.");
  };

  const loadBestResume = () => {
    setResumeData({
      fullName: bestResume.name,
      email: "23SE02ML196@PPSU.AC.IN",
      phone: "+91 8401338599",
      resumeLink: "https://github.com/pujansomaiya",
      headline: bestResume.title,
      summary: bestResume.summary,
      experience: bestResume.experience,
      education: bestResume.education,
      skills: bestResume.skills,
    });
    setSkillsText(bestResume.skills.join(", "));
    setMessage("Best resume loaded. This version is polished and ready to customize.");
  };

  const loadDevOpsResume = () => {
    setResumeData({
      fullName: devopsResume.name,
      email: "rohan.mehta@email.com",
      phone: "+91 98989 12345",
      resumeLink: "https://example.com/resume/rohan-mehta.pdf",
      headline: devopsResume.title,
      summary: devopsResume.summary,
      experience: devopsResume.experience,
      education: devopsResume.education,
      skills: devopsResume.skills,
    });
    setSkillsText(devopsResume.skills.join(", "));
    setMessage("DevOps & Cloud Engineer demo resume loaded. Customize it for infrastructure roles.");
  };

  // Experience Handlers
  const addExperience = () => {
    setResumeData((cur) => ({
      ...cur,
      experience: [
        ...cur.experience,
        { role: "", company: "", period: "", details: [""] },
      ],
    }));
  };

  const removeExperience = (index) => {
    setResumeData((cur) => ({
      ...cur,
      experience: cur.experience.filter((_, i) => i !== index),
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData((cur) => {
      const next = { ...cur };
      if (field === "details") {
        next.experience = next.experience.map((it, i) =>
          i === index ? { ...it, details: value.split(/\r?\n/).filter(Boolean) } : it
        );
      } else {
        next.experience = next.experience.map((it, i) =>
          i === index ? { ...it, [field]: value } : it
        );
      }
      return next;
    });
  };

  // Education Handlers
  const addEducation = () => {
    setResumeData((cur) => ({
      ...cur,
      education: [
        ...cur.education,
        { degree: "", school: "", period: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    setResumeData((cur) => ({
      ...cur,
      education: cur.education.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData((cur) => {
      const next = { ...cur };
      next.education = next.education.map((it, i) =>
        i === index ? { ...it, [field]: value } : it
      );
      return next;
    });
  };

  // Skills Handlers
  const addSkill = () => {
    setResumeData((cur) => ({
      ...cur,
      skills: [...cur.skills, ""],
    }));
    setSkillsText([...resumeData.skills, ""].join(", "));
  };

  const removeSkill = (index) => {
    const updatedSkills = resumeData.skills.filter((_, i) => i !== index);
    setResumeData((cur) => ({
      ...cur,
      skills: updatedSkills,
    }));
    setSkillsText(updatedSkills.join(", "));
  };

  const updateSkill = (index, value) => {
    const updatedSkills = resumeData.skills.map((skill, i) =>
      i === index ? value : skill
    );
    setResumeData((cur) => ({
      ...cur,
      skills: updatedSkills,
    }));
    setSkillsText(updatedSkills.join(", "));
  };

  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState("");
  const [targetJobId, setTargetJobId] = useState(jobId || "");
  const [jobs, setJobs] = useState([]);
  const [selectedRequiredSkills, setSelectedRequiredSkills] = useState([]);

  // Find current selected job and its required skills
  const selectedJob = jobs.find((j) => j._id === targetJobId);
  const requiredSkills = selectedJob?.skills || [];
  const matchPercentage = requiredSkills.length > 0
    ? (selectedRequiredSkills.length / requiredSkills.length) * 100
    : 100;

  // Auto-check skills that match the resume skills when the target job or resume skills change
  useEffect(() => {
    if (!selectedJob || !requiredSkills.length) {
      setSelectedRequiredSkills([]);
      return;
    }
    const resumeSkillsLower = (resumeData.skills || []).map((s) => s.toLowerCase().trim());
    const matched = requiredSkills.filter((skill) =>
      resumeSkillsLower.includes(skill.toLowerCase().trim())
    );
    setSelectedRequiredSkills(matched);
  }, [targetJobId, resumeData.skills, jobs]);

  // Load jobs list so user can pick which job to apply to
  useState(() => {
    fetch(`${API}/api/jobs`)
      .then((r) => r.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => {});
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("✅ Resume data saved. Use 'Apply to Job' below to submit your application.");
  };

  const handleApply = async () => {
    if (!targetJobId) { setApplyMsg("Please select a job to apply to."); return; }
    if (!resumeData.fullName || !resumeData.email) { setApplyMsg("Please fill in your name and email."); return; }

    if (requiredSkills.length > 0 && matchPercentage < 75) {
      setApplyMsg(`❌ Submission blocked: You must match at least 75% of the required skills. Current: ${Math.round(matchPercentage)}%`);
      return;
    }

    setApplying(true);
    setApplyMsg("");
    try {
      const combinedSkills = Array.from(
        new Set([
          ...selectedRequiredSkills,
          ...(resumeData.skills || []),
        ])
      );

      const res = await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: targetJobId,
          applicantName: resumeData.fullName,
          applicantEmail: resumeData.email,
          applicantPhone: resumeData.phone,
          headline: resumeData.headline,
          summary: resumeData.summary,
          linkedinUrl: resumeData.linkedinUrl,
          experience: resumeData.experience,
          education: resumeData.education,
          message: resumeData.summary,
          resumeUrl: resumeData.resumeLink,
          applicantSkills: combinedSkills,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setApplyMsg(data.message || "Failed to apply."); return; }
      const score = data.matchScore ?? 0;
      setApplyMsg(`✅ Applied successfully! Your skill match score: ${score}% ${score >= 80 ? "🟢 Excellent!" : score >= 50 ? "🟡 Good — consider adding more matching skills." : "🔴 Low match — update your skills to improve visibility."}`);
    } catch (e) {
      setApplyMsg("❌ Unable to connect to the server.");
    } finally {
      setApplying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container resume-builder-page">
      <div className="resume-builder-grid">
        <div className="card form-card">
          <h2>Interactive Resume Builder</h2>
          <p className="section-copy">Select a pre-built demo profile template, edit your details, and export your polished resume.</p>
          
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <button className="btn btn-primary" type="button" onClick={loadBestResume} style={{ fontSize: "0.85rem", padding: "0.5rem 0.75rem" }}>
              Best Resume (Designer)
            </button>
            <button className="btn btn-secondary" type="button" onClick={loadSample} style={{ fontSize: "0.85rem", padding: "0.5rem 0.75rem" }}>
              Sample (Developer)
            </button>
            <button className="btn btn-secondary" type="button" onClick={loadDevOpsResume} style={{ fontSize: "0.85rem", padding: "0.5rem 0.75rem" }}>
              Demo (DevOps)
            </button>
          </div>

          <form className="form-grid resume-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                name="fullName"
                value={resumeData.fullName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={resumeData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="phone"
                value={resumeData.phone}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Resume Link (Portfolio/PDF link)
              <input
                type="url"
                name="resumeLink"
                value={resumeData.resumeLink}
                onChange={handleChange}
                placeholder="https://"
              />
            </label>
            <label>
              LinkedIn Profile
              <input
                type="url"
                name="linkedinUrl"
                value={resumeData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/your-name"
              />
            </label>
            <label>
              Headline
              <input
                name="headline"
                value={resumeData.headline}
                onChange={handleChange}
                placeholder="Your target job title"
              />
            </label>
            <label>
              Professional Summary
              <textarea
                name="summary"
                value={resumeData.summary}
                onChange={handleChange}
                rows="4"
              />
            </label>

            {/* Experience Section */}
            <div className="experience-editor" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem", marginTop: "1rem" }}>
              <h4 style={{ margin: "0.5rem 0 1rem", color: "var(--primary)" }}>Work Experience</h4>
              {resumeData.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="experience-row"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.02)",
                    padding: "1rem",
                    borderRadius: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <label style={{ marginBottom: "0.5rem" }}>
                    Role / Position
                    <input value={exp.role} onChange={(e) => updateExperience(idx, "role", e.target.value)} required />
                  </label>
                  <label style={{ marginBottom: "0.5rem" }}>
                    Company Name
                    <input value={exp.company} onChange={(e) => updateExperience(idx, "company", e.target.value)} required />
                  </label>
                  <label style={{ marginBottom: "0.5rem" }}>
                    Period (e.g. Jan 2022 - Present)
                    <input value={exp.period} onChange={(e) => updateExperience(idx, "period", e.target.value)} required />
                  </label>
                  <label style={{ marginBottom: "0.5rem" }}>
                    Key Achievements (one per line)
                    <textarea
                      rows="3"
                      value={exp.details.join("\n")}
                      onChange={(e) => updateExperience(idx, "details", e.target.value)}
                      required
                    />
                  </label>
                  <button type="button" className="btn btn-secondary" onClick={() => removeExperience(idx)} style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", marginTop: "0.5rem" }}>
                    Remove Work Experience
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addExperience} style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", marginBottom: "1rem" }}>
                + Add Experience
              </button>
            </div>

            {/* Education Section */}
            <div className="education-editor" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem", marginTop: "1rem" }}>
              <h4 style={{ margin: "0.5rem 0 1rem", color: "var(--primary)" }}>Education</h4>
              {resumeData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="education-row"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.02)",
                    padding: "1rem",
                    borderRadius: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <label style={{ marginBottom: "0.5rem" }}>
                    Degree / Course
                    <input value={edu.degree} onChange={(e) => updateEducation(idx, "degree", e.target.value)} required />
                  </label>
                  <label style={{ marginBottom: "0.5rem" }}>
                    School / University
                    <input value={edu.school} onChange={(e) => updateEducation(idx, "school", e.target.value)} required />
                  </label>
                  <label style={{ marginBottom: "0.5rem" }}>
                    Period (e.g. 2018 - 2022)
                    <input value={edu.period} onChange={(e) => updateEducation(idx, "period", e.target.value)} required />
                  </label>
                  <button type="button" className="btn btn-secondary" onClick={() => removeEducation(idx)} style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", marginTop: "0.5rem" }}>
                    Remove Education
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addEducation} style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", marginBottom: "1rem" }}>
                + Add Education
              </button>
            </div>

            {/* Skills Section */}
            <div className="skills-editor" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem", marginTop: "1rem", gridColumn: "1 / -1" }}>
              <h4 style={{ margin: "0.5rem 0 1rem", color: "var(--primary)" }}>🎯 Skills</h4>
              {resumeData.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="skill-row"
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                    alignItems: "center",
                  }}
                >
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
                    style={{ fontSize: "0.75rem", padding: "0.4rem 0.6rem", minWidth: "80px" }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addSkill}
                style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", marginTop: "0.5rem" }}
              >
                + Add Skill
              </button>
            </div>

            <button className="btn btn-primary" type="submit" style={{ marginTop: "1.5rem" }}>
              Save Resume Data
            </button>
          </form>
          {message && <p className="form-message" style={{ color: "#34d399" }}>{message}</p>}
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0 }}>Resume Live Preview</h3>
            <button className="btn btn-primary" onClick={handlePrint} style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}>
              🖨️ Export PDF / Print
            </button>
          </div>

          <div className="card resume-preview-card">
            <div className="resume-header">
              <div>
                <h2>{resumeData.fullName || "Your Name"}</h2>
                <p className="resume-headline">{resumeData.headline || "Professional Title"}</p>
              </div>
              <div className="contact-block">
                <p>{resumeData.email || "email@example.com"}</p>
                <p>{resumeData.phone || "+91 12345 67890"}</p>
                {resumeData.resumeLink && (
                  <p style={{ fontSize: "0.85rem" }}>
                    <a href={resumeData.resumeLink} target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>
                      Link to Portfolio
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="resume-section">
              <h3>Summary</h3>
              <p>{resumeData.summary || "A short summary of your strengths and career focus."}</p>
            </div>

            <div className="resume-section">
              <h3>Experience</h3>
              {resumeData.experience.length === 0 && <p style={{ color: "#94a3b8" }}>No work experience added.</p>}
              {resumeData.experience.map((item, index) => (
                <div key={index} className="resume-item">
                  <div className="resume-item-title">
                    <strong>{item.role}</strong> {item.company ? `• ${item.company}` : ""}
                  </div>
                  <div className="resume-item-period">{item.period}</div>
                  <ul style={{ paddingLeft: "1.25rem", margin: "0.25rem 0" }}>
                    {item.details.map((detail, detailIndex) => (
                      <li key={detailIndex} style={{ color: "#cbd5e1" }}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <h3>Education</h3>
              {resumeData.education.length === 0 && <p style={{ color: "#94a3b8" }}>No education added.</p>}
              {resumeData.education.map((item, index) => (
                <div key={index} className="resume-item">
                  <div className="resume-item-title">
                    <strong>{item.degree}</strong>
                  </div>
                  <div style={{ color: "#cbd5e1" }}>{item.school}</div>
                  <div className="resume-item-period">{item.period}</div>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <h3>Skills</h3>
              {resumeData.skills.length === 0 && <p style={{ color: "#94a3b8" }}>No skills added.</p>}
              <div className="resume-skills">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── APPLY TO JOB PANEL ── */}
      <div className="card" style={{ marginTop: "1.5rem", padding: "1.75rem" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>🚀 Apply to a Job</h3>
        <p style={{ color: "var(--muted)", marginBottom: "1.25rem", fontSize: "0.95rem" }}>
          Select a job below. Your skills will be matched against the job's required skills and a score will be shown to the recruiter.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={targetJobId}
            onChange={(e) => setTargetJobId(e.target.value)}
            style={{
              flex: "1 1 300px", padding: "0.75rem 1rem", borderRadius: "0.75rem",
              background: "rgba(3,7,18,0.7)", color: "var(--text)",
              border: "1px solid rgba(255,255,255,0.12)", fontSize: "0.95rem"
            }}
          >
            <option value="">— Select a Job to Apply —</option>
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title} @ {j.company} {j.skills?.length ? `(Requires: ${j.skills.slice(0,3).join(", ")}${j.skills.length > 3 ? "…" : ""})` : ""}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={handleApply}
            disabled={applying || !targetJobId || (requiredSkills.length > 0 && matchPercentage < 75)}
            style={{ opacity: (applying || !targetJobId || (requiredSkills.length > 0 && matchPercentage < 75)) ? 0.5 : 1 }}
          >
            {applying ? "Submitting..." : "📨 Submit Application"}
          </button>
        </div>

        {/* Recruiter's Required Skills Section */}
        {requiredSkills.length > 0 && (
          <div style={{
            marginTop: "1.25rem",
            marginBottom: "1.25rem",
            padding: "1rem",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "0.75rem",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <strong style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
              🎯 Recruiter's Required Skills (Select all you possess - Min 75% required):
            </strong>
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
              <span>({selectedRequiredSkills.length} of {requiredSkills.length} matched)</span>
              {matchPercentage < 75 && (
                <span style={{ color: "var(--highlight)", fontSize: "0.8rem", marginLeft: "auto" }}>
                  ⚠️ Need at least 75% match to submit
                </span>
              )}
            </div>
          </div>
        )}

        {/* Current skills preview */}
        {resumeData.skills.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Your resume skills: </span>
            {resumeData.skills.map((s) => (
              <span key={s} className="tag-badge" style={{ marginRight: "0.4rem", marginTop: "0.3rem", display: "inline-block" }}>{s}</span>
            ))}
          </div>
        )}

        {applyMsg && (
          <p style={{
            marginTop: "1rem", fontWeight: 600, fontSize: "0.95rem",
            color: applyMsg.startsWith("✅") ? "var(--accent-2)" : "var(--highlight)"
          }}>
            {applyMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplyJob;
