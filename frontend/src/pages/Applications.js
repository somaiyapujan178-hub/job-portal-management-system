import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Applications = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [minScore, setMinScore] = useState(75);
  const [sortBy, setSortBy] = useState("score");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch(`${API}/api/jobs`),
          fetch(`${API}/api/applications`),
        ]);
        const jobsData = await jobsRes.json();
        const appsData = await appsRes.json();

        // For recruiters: filter jobs by their name/ID
        const myName = user?.name || "";
        const myId = user?._id || "";
        const myJobs = Array.isArray(jobsData)
          ? jobsData.filter((j) => j.postedBy === myName || j.postedById === myId)
          : [];
        setJobs(myJobs);

        // Filter applications for recruiter's jobs
        const myJobIds = new Set(myJobs.map((j) => j._id));
        const myApps = Array.isArray(appsData)
          ? appsData.filter((a) => {
              const jobId = a.job?._id || a.job;
              return myJobIds.has(jobId);
            })
          : [];
        setApplications(myApps);
      } catch (error) {
        console.error(error);
        setApplications([]);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getFilteredApps = () => {
    let apps = [...applications];
    // Score filter
    apps = apps.filter((a) => (a.matchScore ?? 0) >= minScore);
    // Status filter
    if (statusFilter !== "All") apps = apps.filter((a) => (a.status || "Submitted") === statusFilter);
    // Sort
    if (sortBy === "score") apps.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    else apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return apps;
  };

  const filteredApps = getFilteredApps();
  const updateAppStatus = async (appId, status) => {
    try {
      await fetch(`${API}/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setApplications((prev) => prev.map((a) => a._id === appId ? { ...a, status } : a));
    } catch { console.error("Error updating status"); }
  };

  return (
    <div className="page-container">
      <div className="card dashboard-hero">
        <div>
          <p className="eyebrow">View Applicants</p>
          <h2>👥 Job Applicants</h2>
          <p>View detailed profiles of candidates who applied to your jobs with full skills and background information.</p>
        </div>
        <div className="profile-progress-card">
          <div className="profile-progress-label">Total Applicants</div>
          <div className="profile-progress-value">{applications.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{
        background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)",
        borderRadius: "1.25rem", padding: "1.25rem", marginBottom: "1.5rem"
      }}>
        <h4 style={{ margin: "0 0 1rem", color: "var(--primary-light)" }}>🎯 Filter & Sort</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 260px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--muted-2)" }}>
              Minimum Skill Match: <strong style={{ color: minScore >= 80 ? "#10B981" : minScore >= 50 ? "#F59E0B" : "#FF6B6B" }}>{minScore}%</strong>
            </label>
            <input type="range" min="0" max="100" step="5" value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              style={{ width: "100%", accentColor: minScore >= 80 ? "#10B981" : minScore >= 50 ? "#F59E0B" : "#FF6B6B" }}
            />
          </div>
          <div style={{ flex: "0 1 180px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--muted-2)" }}>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "0.6rem", background: "rgba(3,7,18,0.7)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <option value="score">📈 Match Score (High → Low)</option>
              <option value="date">📅 Date Applied (Newest)</option>
            </select>
          </div>
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
          <button className="btn btn-secondary" onClick={() => { setMinScore(75); setSortBy("score"); setStatusFilter("All"); }}>↺ Reset</button>
        </div>
      </div>

      {/* Selected Applicant Profile */}
      {selectedApplicant && (
        <div className="card" style={{ background: "rgba(59,130,246,0.08)", border: "2px solid rgba(96,165,250,0.45)", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: "0.35rem" }}>📋 Applicant Profile</p>
              <h3 style={{ margin: 0 }}>👤 {selectedApplicant.applicantName}</h3>
            </div>
            <button className="btn btn-secondary" onClick={() => setSelectedApplicant(null)}>✕ Close</button>
          </div>
          <div style={{ display: "grid", gap: "0.85rem", lineHeight: "1.6" }}>
            <div><strong>📧 Email:</strong> <a href={`mailto:${selectedApplicant.applicantEmail}`} style={{ color: "var(--primary-light)" }}>{selectedApplicant.applicantEmail}</a></div>
            {selectedApplicant.applicantPhone && <div><strong>📱 Phone:</strong> {selectedApplicant.applicantPhone}</div>}
            {selectedApplicant.headline && <div><strong>💼 Headline:</strong> {selectedApplicant.headline}</div>}
            {selectedApplicant.summary && <div><strong>📝 Professional Summary:</strong> {selectedApplicant.summary}</div>}
            
            {selectedApplicant.applicantSkills?.length > 0 && (
              <div>
                <strong>🎯 Skills:</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
                  {selectedApplicant.applicantSkills.map((skill) => (
                    <span key={skill} className="tag-badge" style={{ background: "rgba(59,130,246,0.15)", borderColor: "rgba(96,165,250,0.3)" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedApplicant.experience?.length > 0 && (
              <div>
                <strong>💼 Work Experience:</strong>
                <div style={{ marginTop: "0.4rem", paddingLeft: "1rem" }}>
                  {selectedApplicant.experience.map((item, index) => (
                    <div key={`${item.role}-${index}`} style={{ marginBottom: "0.5rem" }}>
                      <strong>{item.role}</strong> at {item.company} <span style={{ color: "var(--muted)" }}>({item.period})</span>
                      {item.details?.length > 0 && <div style={{ color: "var(--muted-2)", fontSize: "0.9rem" }}>• {item.details.join(" • ")}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedApplicant.education?.length > 0 && (
              <div>
                <strong>🎓 Education:</strong>
                <div style={{ marginTop: "0.4rem", paddingLeft: "1rem" }}>
                  {selectedApplicant.education.map((item, index) => (
                    <div key={`${item.degree}-${index}`} style={{ marginBottom: "0.5rem" }}>
                      <strong>{item.degree}</strong> from {item.school} <span style={{ color: "var(--muted)" }}>({item.period})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              {selectedApplicant.linkedinUrl && (
                <a href={selectedApplicant.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}>
                  🔗 LinkedIn Profile
                </a>
              )}
              {selectedApplicant.resumeUrl && (
                <a href={selectedApplicant.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}>
                  📄 View Resume
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Applicants List */}
      {loading ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>⏳ Loading applicants...</p>
      ) : filteredApps.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
          <p>No applicants match your filter criteria.</p>
          {applications.length > 0 && <p style={{ fontSize: "0.9rem" }}>Try lowering the skill match threshold.</p>}
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {filteredApps.map((app) => {
            const score = app.matchScore ?? 0;
            const job = jobs.find((j) => j._id === (app.job?._id || app.job));
            const jobSkills = (job?.skills || []).map((s) => s.toLowerCase());
            const appSkills = (app.applicantSkills || []).map((s) => s.toLowerCase());
            const matched = jobSkills.filter((s) => appSkills.includes(s));
            const missing = jobSkills.filter((s) => !appSkills.includes(s));

            return (
              <div key={app._id} className="card" style={{
                borderLeft: `4px solid ${score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#FF6B6B"}`,
                background: "rgba(3,7,18,0.5)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: "300px" }}>
                    {/* Applicant Name & Score */}
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h3 style={{ margin: "0 0 0.3rem", color: "var(--text)" }}>👤 {app.applicantName}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.4rem 0.8rem", borderRadius: "999px",
                          background: `${score >= 80 ? "rgba(16,185,129,0.1)" : score >= 50 ? "rgba(245,158,11,0.1)" : "rgba(255,107,107,0.1)"}`,
                          border: `1px solid ${score >= 80 ? "rgba(16,185,129,0.3)" : score >= 50 ? "rgba(245,158,11,0.3)" : "rgba(255,107,107,0.3)"}`
                        }}>
                          <strong style={{ color: score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#FF6B6B" }}>
                            {score >= 80 ? "⭐ Excellent" : score >= 50 ? "👍 Good" : "⚠️ Low"}
                          </strong>
                          <span style={{ color: score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#FF6B6B" }}>
                            {score}% Match
                          </span>
                        </div>
                        <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Email & Contact */}
                    <div style={{ marginBottom: "0.75rem", color: "var(--muted)" }}>
                      <div>📧 {app.applicantEmail}</div>
                      {app.applicantPhone && <div>📱 {app.applicantPhone}</div>}
                    </div>

                    {/* Skills Display */}
                    {app.applicantSkills?.length > 0 && (
                      <div style={{ marginBottom: "0.75rem" }}>
                        <strong style={{ fontSize: "0.9rem", color: "var(--muted-2)" }}>🎯 Skills ({app.applicantSkills.length}):</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.3rem" }}>
                          {app.applicantSkills.map((skill) => (
                            <span key={skill} className="tag-badge" style={{
                              background: "rgba(59,130,246,0.15)",
                              borderColor: "rgba(96,165,250,0.3)",
                              fontSize: "0.75rem",
                              color: "var(--text)"
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Match/Missing Skills */}
                    {jobSkills.length > 0 && (
                      <div style={{ marginBottom: "0.75rem" }}>
                        <strong style={{ fontSize: "0.9rem", color: "var(--muted-2)" }}>📋 Job Requirements:</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.3rem" }}>
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
                      </div>
                    )}

                    {/* Headline */}
                    {app.headline && <p style={{ margin: "0.5rem 0", color: "var(--muted-2)", fontSize: "0.9rem" }}><strong>💼</strong> {app.headline}</p>}

                    {/* Links */}
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                      <button className="btn btn-primary" onClick={() => setSelectedApplicant(app)} style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}>
                        👁️ View Full Profile
                      </button>
                      {app.linkedinUrl && (
                        <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}>
                          🔗 LinkedIn
                        </a>
                      )}
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}>
                          📄 Resume
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Status & Job Info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "200px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--muted-2)" }}>Status</label>
                      <select value={app.status || "Submitted"}
                        onChange={(e) => updateAppStatus(app._id, e.target.value)}
                        style={{
                          width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.6rem", fontSize: "0.85rem",
                          background: "rgba(3,7,18,0.8)", color: "var(--text)",
                          border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer"
                        }}>
                        <option>Submitted</option>
                        <option>Reviewed</option>
                        <option>Accepted</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                    {job && (
                      <div>
                        <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--muted-2)" }}>Applied For</label>
                        <div style={{ padding: "0.6rem", background: "rgba(59,130,246,0.08)", borderRadius: "0.6rem", fontSize: "0.9rem", color: "var(--primary-light)", fontWeight: "600" }}>
                          {job.title} @ {job.company}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--muted-2)", textAlign: "center" }}>
        Showing <strong>{filteredApps.length}</strong> of <strong>{applications.length}</strong> applicants
      </div>
    </div>
  );
};

export default Applications;