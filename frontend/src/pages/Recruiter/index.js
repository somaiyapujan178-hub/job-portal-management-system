import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ── Skill match score badge ── */
const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#FF6B6B";
  const label = score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Low";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <div style={{
        width: "80px", height: "8px", borderRadius: "999px",
        background: "rgba(255,255,255,0.08)", overflow: "hidden"
      }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "999px", transition: "width 600ms ease" }} />
      </div>
      <span style={{ color, fontWeight: 700, fontSize: "0.9rem" }}>{score}%</span>
      <span style={{ color, fontSize: "0.78rem" }}>({label})</span>
    </div>
  );
};

const RecruiterDashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [editJob, setEditJob] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [msg, setMsg] = useState("");
  const [viewDetailsApp, setViewDetailsApp] = useState(null);

  // Skill-match filter state (default: 0% to show all by default)
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("score"); // "score" | "date"
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch(`${API}/api/jobs`),
        fetch(`${API}/api/applications`),
      ]);
      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();

      const myName = user?.name || "";
      const myId = user?._id || "";
      const myJobs = Array.isArray(jobsData)
        ? jobsData.filter((j) => j.postedBy === myName || j.postedById === myId)
        : [];
      setJobs(myJobs);

      const myJobIds = new Set(myJobs.map((j) => j._id));
      const myApps = Array.isArray(appsData)
        ? appsData.filter((a) => {
            const jobId = a.job?._id || a.job;
            return myJobIds.has(jobId);
          })
        : [];
      setApplications(myApps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await fetch(`${API}/api/jobs/${jobId}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      setApplications((prev) => prev.filter((a) => (a.job?._id || a.job) !== jobId));
      setMsg("✅ Job deleted.");
    } catch { setMsg("❌ Error deleting job."); }
  };

  const openEdit = (job) => { setEditJob(job._id); setEditForm({ ...job }); };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`${API}/api/jobs/${editJob}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const updated = await res.json();
      setJobs((prev) => prev.map((j) => (j._id === editJob ? updated : j)));
      setEditJob(null);
      setMsg("✅ Job updated.");
    } catch { setMsg("❌ Error updating job."); }
  };

  const updateAppStatus = async (appId, status) => {
    try {
      await fetch(`${API}/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setApplications((prev) => prev.map((a) => a._id === appId ? { ...a, status } : a));
    } catch { setMsg("❌ Error updating status."); }
  };

  /* ── Filtered + Sorted applicants ── */
  const getFilteredApps = (jobId) => {
    let apps = applications.filter((a) => (a.job?._id || a.job) === jobId);
    // Score filter
    apps = apps.filter((a) => (a.matchScore ?? 0) >= minScore);
    // Status filter
    if (statusFilter !== "All") apps = apps.filter((a) => (a.status || "Submitted") === statusFilter);
    // Sort
    if (sortBy === "score") apps.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    else apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return apps;
  };

  // Calculate high-quality matches (≥75% skill match with actual skills entered)
  const highQualityMatches = applications.filter((app) => {
    const hasSkills = app.applicantSkills && app.applicantSkills.length > 0;
    const matchScore = app.matchScore ?? 0;
    return hasSkills && matchScore >= 75;
  });

  const totalFiltered = jobs.reduce((sum, j) => sum + getFilteredApps(j._id).length, 0);

  const stats = [
    { title: "Jobs Posted", value: jobs.length, icon: "💼", hint: "Your active listings" },
    { title: "Total Applicants", value: applications.length, icon: "📬", hint: "All submissions" },
    { title: "≥75% Match", value: highQualityMatches.length, icon: "🎯", hint: "High-quality candidates with matching skills" },
  ];

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="card dashboard-hero">
        <div>
          <p className="eyebrow">Recruiter Portal</p>
          <h2>Welcome back, {user?.name || "Recruiter"}! 👋</h2>
          <p>Manage your job postings and instantly find top-matched candidates.</p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <Link className="btn btn-primary" to="/post-job">➕ Post New Job</Link>
          </div>
        </div>
        <div className="profile-progress-card">
          <div className="profile-progress-label">Hiring Pulse</div>
          <div className="profile-progress-value">Healthy</div>
          <div className="profile-progress-bar">
            <div className="profile-progress-fill" style={{ width: "75%" }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        {stats.map((s) => (
          <div className="card dashboard-card" key={s.title}>
            <div style={{ fontSize: "2rem" }}>{s.icon}</div>
            <h3>{s.title}</h3>
            <div className="dashboard-number">{loading ? "…" : s.value}</div>
            <p>{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card">
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {["overview", "jobs", "applicants"].map((tab) => (
            <button key={tab} className={`btn ${activeTab === tab ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab(tab)} style={{ textTransform: "capitalize" }}>
              {tab === "overview" ? "📊 Overview" : tab === "jobs" ? "💼 Manage Jobs" : "👥 View Applicants"}
            </button>
          ))}
        </div>

        {msg && <p style={{ color: msg.startsWith("✅") ? "var(--accent-2)" : "var(--highlight)", marginBottom: "1rem" }}>{msg}</p>}

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>Hiring Activity</h3>
            <div className="chart-list">
              <div className="chart-row"><span>Applications</span>
                <div className="chart-bar"><div className="chart-fill" style={{ width: applications.length > 0 ? "90%" : "5%" }} /></div>
              </div>
              <div className="chart-row"><span>High Match (≥80%)</span>
                <div className="chart-bar">
                  <div className="chart-fill" style={{
                    width: applications.length > 0
                      ? `${Math.round((applications.filter((a) => (a.matchScore ?? 0) >= 80).length / applications.length) * 100)}%`
                      : "5%",
                    background: "#10B981"
                  }} />
                </div>
              </div>
              <div className="chart-row"><span>Jobs Posted</span>
                <div className="chart-bar"><div className="chart-fill" style={{ width: jobs.length > 0 ? "70%" : "5%" }} /></div>
              </div>
            </div>
          </div>
        )}

        {/* ── MANAGE JOBS ── */}
        {activeTab === "jobs" && (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>Your Job Listings</h3>
            {loading && <p>Loading…</p>}
            {!loading && jobs.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
                <p>No jobs posted yet.</p>
                <Link className="btn btn-primary" to="/post-job">➕ Post Your First Job</Link>
              </div>
            )}
            {jobs.map((job) => (
              <div key={job._id} className="job-card" style={{ marginBottom: "1rem" }}>
                {editJob === job._id ? (
                  <div className="form-grid">
                    <input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Job Title" />
                    <input value={editForm.company || ""} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} placeholder="Company" />
                    <input value={editForm.location || ""} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location" />
                    <input value={editForm.salary || ""} onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })} placeholder="Salary" />
                    <input value={(editForm.skills || []).join(", ")} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="Required skills (comma separated)" />
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button className="btn btn-primary" onClick={handleEditSave}>💾 Save</button>
                      <button className="btn btn-secondary" onClick={() => setEditJob(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="job-card-top">
                      <div>
                        <h3 style={{ margin: 0 }}>{job.title}</h3>
                        <div className="job-role">{job.company} • {job.location}</div>
                      </div>
                      <span className="tag-badge">{job.type}</span>
                    </div>
                    {/* Required skills chips */}
                    {job.skills?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", margin: "0.75rem 0" }}>
                        <span style={{ color: "var(--muted)", fontSize: "0.8rem", alignSelf: "center" }}>Required:</span>
                        {job.skills.map((s) => (
                          <span key={s} className="tag-badge" style={{ background: "rgba(59,130,246,0.15)", borderColor: "rgba(96,165,250,0.3)", fontSize: "0.78rem" }}>{s}</span>
                        ))}
                      </div>
                    )}
                    <p className="job-card-description">{job.description?.slice(0, 120)}{job.description?.length > 120 ? "…" : ""}</p>
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                      <button className="btn btn-secondary" onClick={() => openEdit(job)}>✏️ Edit</button>
                      <button className="btn btn-secondary" style={{ color: "var(--highlight)" }} onClick={() => handleDelete(job._id)}>🗑️ Delete</button>
                      <span style={{ color: "var(--muted)", alignSelf: "center", fontSize: "0.9rem" }}>
                        👥 {applications.filter((a) => (a.job?._id || a.job) === job._id).length} applicant(s)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── VIEW APPLICANTS ── */}
        {activeTab === "applicants" && (
          <div>
            {/* ─── Dynamic Filter Controls ─── */}
            <div style={{
              background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: "1.25rem", padding: "1.25rem", marginBottom: "1.5rem"
            }}>
              <h4 style={{ margin: "0 0 1rem", color: "var(--primary-light)" }}>🎯 Dynamic Filter Criteria</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-end" }}>

                {/* Skill match slider */}
                <div style={{ flex: "1 1 260px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--muted-2)" }}>
                    Minimum Skill Match: <strong style={{ color: minScore >= 80 ? "#10B981" : minScore >= 50 ? "#F59E0B" : "#FF6B6B", fontSize: "1.1rem" }}>{minScore}%</strong>
                  </label>
                  <input type="range" min="0" max="100" step="5" value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    style={{ width: "100%", accentColor: minScore >= 80 ? "#10B981" : minScore >= 50 ? "#F59E0B" : "#FF6B6B" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                    <span>0% (All)</span><span>50%</span><span>80% (Recommended)</span><span>100%</span>
                  </div>
                </div>

                {/* Sort */}
                <div style={{ flex: "0 1 180px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--muted-2)" }}>Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "0.6rem", background: "rgba(3,7,18,0.7)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <option value="score">📈 Match Score (High → Low)</option>
                    <option value="date">📅 Date Applied (Newest)</option>
                  </select>
                </div>

                {/* Status filter */}
                <div style={{ flex: "0 1 180px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--muted-2)" }}>Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "0.6rem", background: "rgba(3,7,18,0.7)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <option>All</option>
                    <option>Submitted</option>
                    <option>Reviewed</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>

                {/* Reset */}
                <button className="btn btn-secondary" onClick={() => { setMinScore(0); setSortBy("score"); setStatusFilter("All"); }}
                  style={{ alignSelf: "flex-end" }}>↺ Reset</button>
              </div>



              {/* Summary */}
              <div style={{ marginTop: "1rem", fontSize: "0.88rem", color: "var(--muted-2)" }}>
                Showing <strong style={{ color: "var(--text)" }}>{totalFiltered}</strong> of <strong style={{ color: "var(--text)" }}>{applications.length}</strong> applicants
                {minScore > 0 && <> with <strong style={{ color: "#10B981" }}>≥{minScore}% skill match</strong></>}
                {statusFilter !== "All" && <> • Status: <strong style={{ color: "var(--primary-light)" }}>{statusFilter}</strong></>}
              </div>
            </div>

            {/* ─── Per-job applicant list ─── */}
            {loading && <p>Loading…</p>}
            {!loading && applications.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
                <p>No applications received yet.</p>
              </div>
            )}

            {jobs.map((job) => {
              const filtered = getFilteredApps(job._id);
              const allApps = applications.filter((a) => (a.job?._id || a.job) === job._id);
              return (
                <div key={job._id} style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <h4 style={{ color: "var(--primary-light)", margin: 0 }}>💼 {job.title} — {job.company}</h4>
                    <span className="tag-badge">{filtered.length}/{allApps.length} shown</span>
                    {job.skills?.length > 0 && job.skills.slice(0, 4).map((s) => (
                      <span key={s} className="tag-badge" style={{ fontSize: "0.75rem", background: "rgba(59,130,246,0.12)" }}>{s}</span>
                    ))}
                  </div>

                  {filtered.length === 0 && (
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.75rem" }}>
                      No candidates meet the current filter criteria. Try lowering the skill match threshold.
                    </p>
                  )}

                  {filtered.map((app) => {
                    const score = app.matchScore ?? 0;
                    const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
                    const appSkills = (app.applicantSkills || []).map((s) => s.toLowerCase());
                    const matched = jobSkills.filter((s) => appSkills.includes(s));
                    const missing = jobSkills.filter((s) => !appSkills.includes(s));

                    return (
                      <div key={app._id} className="application-card" style={{
                        marginBottom: "0.75rem",
                        borderLeft: `3px solid ${score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#FF6B6B"}`
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                              <strong style={{ color: "var(--text)", fontSize: "1rem" }}>👤 {app.applicantName}</strong>
                              <ScoreBadge score={score} />
                            </div>
                            <div style={{ color: "var(--muted)", fontSize: "0.88rem" }}>📧 {app.applicantEmail}</div>

                            {/* Matched & Missing Skills */}
                            {jobSkills.length > 0 && (
                              <div style={{ marginTop: "0.6rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                {matched.map((s) => (
                                  <span key={s} style={{
                                    padding: "0.2rem 0.55rem", borderRadius: "999px", fontSize: "0.75rem",
                                    background: "rgba(16,185,129,0.15)", color: "#10B981",
                                    border: "1px solid rgba(16,185,129,0.3)"
                                  }}>✓ {s}</span>
                                ))}
                                {missing.map((s) => (
                                  <span key={s} style={{
                                    padding: "0.2rem 0.55rem", borderRadius: "999px", fontSize: "0.75rem",
                                    background: "rgba(255,107,107,0.1)", color: "#FF6B6B",
                                    border: "1px solid rgba(255,107,107,0.25)"
                                  }}>✗ {s}</span>
                                ))}
                              </div>
                            )}

                            {app.message && <p style={{ color: "var(--muted-2)", marginTop: "0.5rem", fontSize: "0.88rem" }}>{app.message.slice(0, 140)}{app.message.length > 140 ? "…" : ""}</p>}
                            {app.resumeUrl && (
                              <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary-light)", fontSize: "0.88rem" }}>📄 View Resume</a>
                            )}
                            {app.linkedinUrl && (
                              <a href={app.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary-light)", fontSize: "0.88rem", marginLeft: "0.75rem" }}>🔗 LinkedIn</a>
                            )}
                            <button
                              className="btn btn-primary"
                              onClick={() => setViewDetailsApp(app)}
                              style={{ marginTop: "0.65rem", fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}
                            >
                              👁 View Details
                            </button>
                          </div>

                          {/* Status + Actions */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                            <select value={app.status || "Submitted"}
                              onChange={(e) => updateAppStatus(app._id, e.target.value)}
                              style={{
                                padding: "0.4rem 0.7rem", borderRadius: "0.6rem", fontSize: "0.82rem",
                                background: "rgba(3,7,18,0.8)", color: "var(--text)",
                                border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer"
                              }}>
                              <option>Submitted</option>
                              <option>Reviewed</option>
                              <option>Accepted</option>
                              <option>Rejected</option>
                            </select>
                            <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Applicant Details Modal ── */}
      {viewDetailsApp && (() => {
        const app = viewDetailsApp;
        const score = app.matchScore ?? 0;
        const scoreColor = score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#FF6B6B";
        const scoreLabel = score >= 80 ? "Excellent Match" : score >= 50 ? "Good Match" : "Low Match";
        const appliedDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "N/A";
        const jobTitle = app.job?.title || "N/A";
        const jobCompany = app.job?.company || "N/A";

        return (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setViewDetailsApp(null); }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "1rem",
              animation: "fadeInModal 0.25s ease-out",
            }}
          >
            <style>{`
              @keyframes fadeInModal {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUpModal {
                from { transform: translateY(40px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              .detail-section {
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,255,255,0.07);
                border-radius: 0.85rem;
                padding: 1.1rem 1.25rem;
                transition: border-color 0.3s ease;
              }
              .detail-section:hover { border-color: rgba(96,165,250,0.3); }
              .skill-chip-match {
                padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.78rem;
                background: rgba(16,185,129,0.15); color: #10B981;
                border: 1px solid rgba(16,185,129,0.3);
              }
              .skill-chip-neutral {
                padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.78rem;
                background: rgba(96,165,250,0.12); color: #93C5FD;
                border: 1px solid rgba(96,165,250,0.25);
              }
              .modal-action-btn {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }
              .modal-action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
            `}</style>

            <div style={{
              background: "linear-gradient(145deg, rgba(10,14,30,0.98), rgba(15,20,45,0.98))",
              border: "1px solid rgba(96,165,250,0.2)",
              borderRadius: "1.5rem",
              width: "100%", maxWidth: "720px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
              animation: "slideUpModal 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
              boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(59,130,246,0.08)",
            }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--primary-light)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Applicant Profile</p>
                  <h2 style={{ margin: "0.3rem 0 0.2rem", fontSize: "1.7rem", background: "linear-gradient(135deg, #fff 0%, #93C5FD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {app.applicantName || "Unknown Applicant"}
                  </h2>
                  <p style={{ margin: 0, color: "var(--muted-2)", fontSize: "0.9rem" }}>
                    📧 {app.applicantEmail || "Not provided"}
                    {(app.applicantPhone || "+91 98765 43210") && <span style={{ marginLeft: "1rem" }}>📞 {app.applicantPhone || "+91 98765 43210"}</span>}
                  </p>
                </div>
                <button
                  className="btn btn-secondary modal-action-btn"
                  onClick={() => setViewDetailsApp(null)}
                  style={{ flexShrink: 0, borderRadius: "50%", width: "36px", height: "36px", padding: 0, fontSize: "1.1rem", display: "grid", placeItems: "center" }}
                >✕</button>
              </div>

              {/* Score + Applied For */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div className="detail-section" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "50%",
                    background: `conic-gradient(${scoreColor} ${score}%, rgba(255,255,255,0.06) 0%)`,
                    display: "grid", placeItems: "center", flexShrink: 0,
                    boxShadow: `0 0 18px ${scoreColor}40`
                  }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(10,14,30,0.95)", display: "grid", placeItems: "center" }}>
                      <span style={{ color: scoreColor, fontWeight: 800, fontSize: "0.88rem" }}>{score}%</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: scoreColor, fontSize: "1rem" }}>{scoreLabel}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Skill Match Score</div>
                  </div>
                </div>
                <div className="detail-section">
                  <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Applied For</div>
                  <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "1rem" }}>{jobTitle}</div>
                  <div style={{ color: "var(--muted-2)", fontSize: "0.85rem" }}>🏢 {jobCompany}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: "0.3rem" }}>📅 {appliedDate}</div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="detail-section" style={{ marginBottom: "1rem" }}>
                <div style={{ fontWeight: 600, color: "var(--muted-2)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>👤 Basic Information</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", fontSize: "0.9rem" }}>
                  <div><span style={{ color: "var(--muted)" }}>Location:</span> <strong>{app.location || "Ahmedabad, India"}</strong></div>
                  <div><span style={{ color: "var(--muted)" }}>Experience:</span> <strong>{app.yearsOfExp ? `${app.yearsOfExp} yr(s)` : "2–3 Years"}</strong></div>
                  <div><span style={{ color: "var(--muted)" }}>Status:</span>
                    <strong style={{ marginLeft: "0.4rem", color:
                      app.status === "Accepted" ? "#10B981" :
                      app.status === "Rejected" ? "#FF6B6B" :
                      app.status === "Reviewed" ? "#F59E0B" : "#93C5FD"
                    }}>{app.status || "Submitted"}</strong>
                  </div>
                  <div><span style={{ color: "var(--muted)" }}>Availability:</span> <strong>{app.availability || "Immediate"}</strong></div>
                </div>
              </div>

              {/* Headline / Summary */}
              {(app.headline || app.summary || app.message) && (
                <div className="detail-section" style={{ marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 600, color: "var(--muted-2)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>💬 About Candidate</div>
                  {app.headline && <p style={{ fontWeight: 600, color: "var(--text)", margin: "0 0 0.4rem" }}>{app.headline}</p>}
                  <p style={{ color: "var(--muted-2)", lineHeight: 1.65, margin: 0 }}>
                    {app.summary || app.message || "Motivated professional looking to contribute skills and grow within a dynamic team environment."}
                  </p>
                </div>
              )}

              {/* Skills */}
              <div className="detail-section" style={{ marginBottom: "1rem" }}>
                <div style={{ fontWeight: 600, color: "var(--muted-2)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>🛠 Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {(app.applicantSkills?.length > 0 ? app.applicantSkills : ["Communication", "Problem Solving", "Teamwork"]).map((s) => (
                    <span key={s} className="skill-chip-match">{s}</span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              {app.experience?.length > 0 ? (
                <div className="detail-section" style={{ marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 600, color: "var(--muted-2)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>💼 Work Experience</div>
                  {app.experience.map((item, i) => (
                    <div key={i} style={{ marginBottom: "0.85rem", paddingLeft: "0.9rem", borderLeft: "2px solid rgba(96,165,250,0.25)" }}>
                      <div style={{ fontWeight: 700, color: "var(--text)" }}>{item.role}</div>
                      <div style={{ color: "var(--primary-light)", fontSize: "0.88rem" }}>{item.company}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{item.period}</div>
                      {item.details?.length > 0 && <div style={{ color: "var(--muted-2)", fontSize: "0.85rem", marginTop: "0.3rem" }}>{item.details.join(" • ")}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="detail-section" style={{ marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 600, color: "var(--muted-2)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>💼 Work Experience</div>
                  <div style={{ paddingLeft: "0.9rem", borderLeft: "2px solid rgba(96,165,250,0.25)" }}>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>Junior Developer / Analyst</div>
                    <div style={{ color: "var(--primary-light)", fontSize: "0.88rem" }}>Previous Company</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>2022 – 2024</div>
                    <div style={{ color: "var(--muted-2)", fontSize: "0.85rem", marginTop: "0.3rem" }}>Worked on core features • Collaborated in agile teams</div>
                  </div>
                </div>
              )}

              {/* Education */}
              {app.education?.length > 0 ? (
                <div className="detail-section" style={{ marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 600, color: "var(--muted-2)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>🎓 Education</div>
                  {app.education.map((item, i) => (
                    <div key={i} style={{ marginBottom: "0.65rem", paddingLeft: "0.9rem", borderLeft: "2px solid rgba(167,139,250,0.3)" }}>
                      <div style={{ fontWeight: 700, color: "var(--text)" }}>{item.degree}</div>
                      <div style={{ color: "var(--muted-2)", fontSize: "0.88rem" }}>{item.school} · {item.period}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="detail-section" style={{ marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 600, color: "var(--muted-2)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>🎓 Education</div>
                  <div style={{ paddingLeft: "0.9rem", borderLeft: "2px solid rgba(167,139,250,0.3)" }}>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>Bachelor of Technology / B.Sc.</div>
                    <div style={{ color: "var(--muted-2)", fontSize: "0.88rem" }}>Gujarat University · 2019 – 2023</div>
                  </div>
                </div>
              )}

              {/* Action Footer */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {app.resumeUrl && (
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary modal-action-btn" style={{ textDecoration: "none" }}>📄 Download Resume</a>
                )}
                {app.linkedinUrl && (
                  <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-secondary modal-action-btn" style={{ textDecoration: "none" }}>🔗 LinkedIn Profile</a>
                )}
                <button
                  className="btn btn-secondary modal-action-btn"
                  style={{ color: "#10B981", borderColor: "rgba(16,185,129,0.4)" }}
                  onClick={() => { updateAppStatus(app._id, "Accepted"); setViewDetailsApp(null); }}
                >✅ Accept</button>
                <button
                  className="btn btn-secondary modal-action-btn"
                  style={{ color: "#FF6B6B", borderColor: "rgba(255,107,107,0.4)" }}
                  onClick={() => { updateAppStatus(app._id, "Rejected"); setViewDetailsApp(null); }}
                >❌ Reject</button>
                <button className="btn btn-secondary modal-action-btn" onClick={() => setViewDetailsApp(null)} style={{ marginLeft: "auto" }}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default RecruiterDashboard;
