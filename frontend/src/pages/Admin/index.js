import { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminDashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch(`${API}/api/jobs`),
          fetch(`${API}/api/applications`),
        ]);
        const jobsData = await jobsRes.json();
        const appsData = await appsRes.json();
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setApplications(Array.isArray(appsData) ? appsData : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await fetch(`${API}/api/jobs/${jobId}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      setMsg("Job deleted successfully.");
    } catch (e) {
      setMsg("Error deleting job.");
    }
  };

  // Get unique recruiters from jobs
  const recruiters = [...new Set(jobs.map((j) => j.postedBy).filter(Boolean))];

  const stats = [
    { title: "Total Jobs", value: jobs.length, icon: "🗂️", hint: "All posted jobs" },
    { title: "Applications", value: applications.length, icon: "📬", hint: "Total submissions" },
    { title: "Recruiters", value: recruiters.length, icon: "🏢", hint: "Active hiring companies" },
    { title: "Platform Health", value: "94%", icon: "📈", hint: "System performance" },
  ];

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="card dashboard-hero">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h2>Platform Overview 🛡️</h2>
          <p>Monitor all jobs, applications, recruiters, and platform activity.</p>
        </div>
        <div className="profile-progress-card">
          <div className="profile-progress-label">Operations</div>
          <div className="profile-progress-value">Stable</div>
          <div className="profile-progress-bar">
            <div className="profile-progress-fill" style={{ width: "94%" }} />
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
          {["overview", "jobs", "applicants", "recruiters"].map((tab) => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab(tab)}
              style={{ textTransform: "capitalize" }}
            >
              {tab === "overview" ? "📊 Overview" :
               tab === "jobs" ? "🗂️ All Jobs" :
               tab === "applicants" ? "👥 All Applicants" : "🏢 Recruiters"}
            </button>
          ))}
        </div>

        {msg && <p style={{ color: "var(--accent-2)", marginBottom: "1rem" }}>{msg}</p>}

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>System Analytics</h3>
            <div className="chart-list">
              <div className="chart-row">
                <span>Jobs Posted</span>
                <div className="chart-bar">
                  <div className="chart-fill" style={{ width: "82%" }} />
                </div>
              </div>
              <div className="chart-row">
                <span>Applications</span>
                <div className="chart-bar">
                  <div className="chart-fill" style={{ width: "94%" }} />
                </div>
              </div>
              <div className="chart-row">
                <span>Recruiter Activity</span>
                <div className="chart-bar">
                  <div className="chart-fill" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALL JOBS */}
        {activeTab === "jobs" && (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>All Job Listings ({jobs.length})</h3>
            {loading && <p>Loading…</p>}
            {!loading && jobs.length === 0 && <p style={{ color: "var(--muted)" }}>No jobs found.</p>}
            {jobs.map((job) => (
              <div key={job._id} className="job-card" style={{ marginBottom: "1rem" }}>
                <div className="job-card-top">
                  <div>
                    <h3 style={{ margin: 0 }}>{job.title}</h3>
                    <div className="job-role">{job.company} • {job.location}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                      Posted by: <strong style={{ color: "var(--primary-light)" }}>{job.postedBy || "Unknown"}</strong>
                    </div>
                  </div>
                  <span className="tag-badge">{job.type}</span>
                </div>
                <p className="job-card-description">{job.description?.slice(0, 120)}…</p>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                  <button
                    className="btn btn-secondary"
                    style={{ color: "var(--highlight)" }}
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    🗑️ Delete
                  </button>
                  <span style={{ color: "var(--muted)", alignSelf: "center", fontSize: "0.9rem" }}>
                    👥 {applications.filter((a) => (a.job?._id || a.job) === job._id).length} applicant(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ALL APPLICANTS */}
        {activeTab === "applicants" && (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>All Applications ({applications.length})</h3>
            {loading && <p>Loading…</p>}
            {!loading && applications.length === 0 && <p style={{ color: "var(--muted)" }}>No applications found.</p>}
            {applications.map((app) => (
              <div key={app._id} className="application-card" style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <strong style={{ color: "var(--text)" }}>👤 {app.applicantName}</strong>
                    <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>📧 {app.applicantEmail}</div>
                    <div style={{ color: "var(--primary-light)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                      💼 Applied to: {app.job?.title || "Unknown Job"} — {app.job?.company || ""}
                    </div>
                    {app.message && (
                      <p style={{ color: "var(--muted-2)", marginTop: "0.4rem", fontSize: "0.9rem" }}>{app.message}</p>
                    )}
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary-light)", fontSize: "0.9rem" }}>
                        📄 View Resume
                      </a>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                    <span
                      className="tag-badge"
                      style={{
                        color:
                          app.status === "Accepted" ? "var(--accent-2)" :
                          app.status === "Rejected" ? "var(--highlight)" : "var(--muted-2)",
                      }}
                    >
                      {app.status || "Pending"}
                    </span>
                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RECRUITERS */}
        {activeTab === "recruiters" && (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>Active Recruiters ({recruiters.length})</h3>
            {loading && <p>Loading…</p>}
            {!loading && recruiters.length === 0 && <p style={{ color: "var(--muted)" }}>No recruiters found.</p>}
            {recruiters.map((name) => {
              const theirJobs = jobs.filter((j) => j.postedBy === name);
              const theirApps = applications.filter((a) => theirJobs.some((j) => j._id === (a.job?._id || a.job)));
              return (
                <div key={name} className="company-card" style={{ marginBottom: "1rem" }}>
                  <h3 style={{ margin: "0 0 0.4rem" }}>🏢 {name}</h3>
                  <p style={{ margin: 0, color: "var(--muted-2)" }}>
                    {theirJobs.length} job(s) posted &nbsp;|&nbsp; {theirApps.length} application(s) received
                  </p>
                  <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {theirJobs.map((j) => (
                      <span key={j._id} className="tag-badge">{j.title}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
