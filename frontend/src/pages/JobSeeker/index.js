import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ── Confetti particles ── */
const Confetti = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2.5 + Math.random() * 2}s`,
    color: ["#10B981", "#60A5FA", "#F59E0B", "#A78BFA", "#F472B6", "#34D399"][i % 6],
    size: `${6 + Math.random() * 8}px`,
    isCircle: Math.random() > 0.5,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: "1.75rem" }}>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(380px) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: 0,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: p.isCircle ? "50%" : "2px",
            background: p.color,
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
};

const JobSeekerDashboard = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedPopup, setAcceptedPopup] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch(`${API}/api/applications`);
        const data = await res.json();
        const myEmail = user?.email || "";
        const myApps = Array.isArray(data)
          ? data.filter((a) => a.applicantEmail === myEmail)
          : [];
        setApplications(myApps);

        // Auto-show popup for the latest accepted app that hasn't been seen yet
        const seenKey = `seen_accepted_${myEmail}`;
        const seenIds = JSON.parse(localStorage.getItem(seenKey) || "[]");
        const acceptedApps = myApps.filter((a) => a.status === "Accepted");
        const newlyAccepted = acceptedApps.find((a) => !seenIds.includes(a._id));
        if (newlyAccepted) {
          setAcceptedPopup(newlyAccepted);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const dismissPopup = () => {
    if (acceptedPopup) {
      const seenKey = `seen_accepted_${user?.email || ""}`;
      const seenIds = JSON.parse(localStorage.getItem(seenKey) || "[]");
      if (!seenIds.includes(acceptedPopup._id)) {
        localStorage.setItem(seenKey, JSON.stringify([...seenIds, acceptedPopup._id]));
      }
    }
    setAcceptedPopup(null);
  };

  const stats = [
    { title: "Applied Jobs",  value: applications.length, icon: "📬", hint: "Total applications submitted" },
    { title: "Pending",       value: applications.filter((a) => !a.status || a.status === "Pending" || a.status === "Submitted").length, icon: "⏳", hint: "Awaiting response" },
    { title: "Accepted",      value: applications.filter((a) => a.status === "Accepted").length, icon: "✅", hint: "Great news!" },
    { title: "Rejected",      value: applications.filter((a) => a.status === "Rejected").length, icon: "❌", hint: "Keep applying!" },
  ];

  return (
    <div className="page-container">

      {/* ══════════════════ CONGRATULATIONS POPUP ══════════════════ */}
      {acceptedPopup && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) dismissPopup(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
            animation: "popupFadeIn 0.35s ease-out",
          }}
        >
          <style>{`
            @keyframes popupFadeIn   { from { opacity:0; } to { opacity:1; } }
            @keyframes popupSlideUp  { from { transform:translateY(60px) scale(0.92); opacity:0; } to { transform:translateY(0) scale(1); opacity:1; } }
            @keyframes glowPulse     { 0%,100% { box-shadow:0 0 32px rgba(16,185,129,0.4), 0 32px 80px rgba(0,0,0,0.75); } 50% { box-shadow:0 0 60px rgba(16,185,129,0.7), 0 32px 80px rgba(0,0,0,0.75); } }
            @keyframes trophyBounce  { 0%,100% { transform:scale(1)    rotate(-5deg); } 50% { transform:scale(1.18) rotate(5deg); } }
            @keyframes shimmerText   { from { background-position:-200% center; } to { background-position:200% center; } }
            .popup-close-btn { transition: background 0.2s ease, transform 0.2s ease; }
            .popup-close-btn:hover { background:rgba(255,255,255,0.14) !important; transform:scale(1.12); }
            .popup-cta { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease; }
            .popup-cta:hover { transform:translateY(-3px); box-shadow:0 14px 30px rgba(0,0,0,0.55); }
          `}</style>

          <div style={{
            position: "relative",
            background: "linear-gradient(155deg, rgba(6,10,24,0.99) 0%, rgba(4,18,15,0.99) 55%, rgba(6,10,24,0.99) 100%)",
            border: "1px solid rgba(16,185,129,0.38)",
            borderRadius: "1.75rem",
            width: "100%", maxWidth: "510px",
            padding: "2.5rem 2rem 2rem",
            textAlign: "center",
            animation: "popupSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards, glowPulse 3s ease-in-out 0.6s infinite",
            overflow: "hidden",
          }}>
            <Confetti />

            {/* Close ✕ */}
            <button
              className="popup-close-btn"
              onClick={dismissPopup}
              style={{
                position: "absolute", top: "1.1rem", right: "1.1rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50%", width: "32px", height: "32px",
                cursor: "pointer", color: "var(--muted-2)", fontSize: "1rem",
                display: "grid", placeItems: "center",
              }}
            >✕</button>

            {/* Trophy */}
            <div style={{
              fontSize: "4rem", marginBottom: "0.65rem",
              animation: "trophyBounce 1.8s ease-in-out 0.5s infinite",
              display: "inline-block",
              filter: "drop-shadow(0 0 22px rgba(245,158,11,0.65))",
            }}>🏆</div>

            {/* Title */}
            <h2 style={{
              margin: "0 0 0.3rem",
              fontSize: "1.9rem", fontWeight: 800,
              background: "linear-gradient(90deg, #10B981 0%, #60A5FA 50%, #10B981 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmerText 3s linear infinite",
            }}>
              Congratulations! 🎉
            </h2>
            <p style={{ color: "var(--muted-2)", fontSize: "1rem", marginBottom: "1.75rem" }}>
              You have been <strong style={{ color: "#10B981" }}>selected</strong>!
            </p>

            {/* Job selection card */}
            <div style={{
              background: "rgba(16,185,129,0.07)",
              border: "1px solid rgba(16,185,129,0.28)",
              borderRadius: "1.1rem",
              padding: "1.25rem 1.4rem",
              marginBottom: "1.25rem",
              textAlign: "left",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "50px", height: "50px", borderRadius: "0.75rem", flexShrink: 0,
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  display: "grid", placeItems: "center", fontSize: "1.55rem",
                }}>🏢</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff" }}>
                    {acceptedPopup.job?.title || "Job Position"}
                  </div>
                  <div style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>
                    {acceptedPopup.job?.company || "Company"}
                  </div>
                  {acceptedPopup.job?.location && (
                    <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: "0.1rem" }}>
                      📍 {acceptedPopup.job.location}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Package banner */}
            <div style={{
              background: "linear-gradient(135deg, rgba(96,165,250,0.09), rgba(167,139,250,0.09))",
              border: "1px solid rgba(96,165,250,0.22)",
              borderRadius: "1rem",
              padding: "1.1rem 1.4rem",
              marginBottom: "1.6rem",
            }}>
              <div style={{ color: "var(--muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.45rem" }}>
                💰 Your Offered Package
              </div>
              <div style={{
                fontWeight: 800, fontSize: "1.8rem",
                background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {acceptedPopup.job?.salary || "Package to be discussed"}
              </div>
              <div style={{ color: "var(--muted-2)", fontSize: "0.8rem", marginTop: "0.3rem" }}>
                {acceptedPopup.job?.type ? `${acceptedPopup.job.type} · ` : ""}Your recruiter will reach out shortly
              </div>
            </div>

            {/* Message */}
            <p style={{
              color: "var(--muted-2)", fontSize: "0.88rem", lineHeight: 1.65,
              marginBottom: "1.75rem", padding: "0 0.35rem",
            }}>
              <strong style={{ color: "#fff" }}>{acceptedPopup.job?.company || "The company"}</strong> has reviewed your profile and is delighted to offer you this opportunity. Your hard work paid off — congratulations! 🚀
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn popup-cta"
                onClick={dismissPopup}
                style={{
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  border: "none", color: "#fff",
                  fontWeight: 700, padding: "0.75rem 1.75rem",
                  borderRadius: "0.75rem", cursor: "pointer",
                }}
              >
                🎊 Awesome, Thanks!
              </button>
              <Link
                to="/applications"
                className="btn btn-secondary popup-cta"
                onClick={dismissPopup}
                style={{ fontWeight: 600 }}
              >
                📋 My Applications
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── Hero ─── */}
      <div className="card dashboard-hero">
        <div>
          <p className="eyebrow">Job Seeker</p>
          <h2>Welcome back, {user?.name || "Talent"}! 👋</h2>
          <p>Track your applications and find new opportunities tailored for you.</p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <Link className="btn btn-primary" to="/jobs">🔍 Search Jobs</Link>
            <Link className="btn btn-secondary" to="/applications">📋 All Applications</Link>
          </div>
        </div>
        <div className="profile-progress-card">
          <div className="profile-progress-label">Profile Completion</div>
          <div className="profile-progress-value">80%</div>
          <div className="profile-progress-bar">
            <div className="profile-progress-fill" style={{ width: "80%" }} />
          </div>
        </div>
      </div>

      {/* ─── Stats ─── */}
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

      {/* ─── Applications list ─── */}
      <div className="card">
        <h3 style={{ marginBottom: "1rem" }}>📋 My Applications</h3>
        {loading && <p>Loading…</p>}
        {!loading && applications.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
            <p>You haven't applied to any jobs yet.</p>
            <Link className="btn btn-primary" to="/jobs">🔍 Find Jobs Now</Link>
          </div>
        )}
        {applications.map((app) => (
          <div
            key={app._id}
            className="application-card"
            style={{
              marginBottom: "0.75rem",
              borderLeft: `3px solid ${
                app.status === "Accepted" ? "#10B981" :
                app.status === "Rejected" ? "#FF6B6B" :
                app.status === "Reviewed" ? "#F59E0B" :
                "rgba(255,255,255,0.08)"
              }`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <strong style={{ color: "var(--text)" }}>
                  💼 {app.job?.title || "Job"} — {app.job?.company || ""}
                </strong>
                <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  📍 {app.job?.location || "—"} &nbsp;|&nbsp; {app.job?.type || "—"}
                </div>
                {app.job?.salary && (
                  <div style={{ color: "#93C5FD", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    💰 {app.job.salary}
                  </div>
                )}
                {app.message && (
                  <p style={{ color: "var(--muted-2)", marginTop: "0.4rem", fontSize: "0.9rem" }}>{app.message}</p>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                <span
                  className="tag-badge"
                  style={{
                    color:
                      app.status === "Accepted" ? "#10B981" :
                      app.status === "Rejected" ? "#FF6B6B" :
                      app.status === "Reviewed" ? "#F59E0B" : "var(--muted-2)",
                    background:
                      app.status === "Accepted" ? "rgba(16,185,129,0.12)" :
                      app.status === "Rejected" ? "rgba(255,107,107,0.1)" :
                      app.status === "Reviewed" ? "rgba(245,158,11,0.1)" : undefined,
                    borderColor:
                      app.status === "Accepted" ? "rgba(16,185,129,0.3)" :
                      app.status === "Rejected" ? "rgba(255,107,107,0.25)" :
                      app.status === "Reviewed" ? "rgba(245,158,11,0.25)" : undefined,
                  }}
                >
                  {app.status === "Accepted" ? "✅ Accepted" :
                   app.status === "Rejected" ? "❌ Rejected" :
                   app.status === "Reviewed" ? "👁 Reviewed" :
                   "⏳ " + (app.status || "Pending")}
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
                {app.status === "Accepted" && (
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: "0.75rem", padding: "0.3rem 0.65rem", color: "#10B981", borderColor: "rgba(16,185,129,0.35)" }}
                    onClick={() => setAcceptedPopup(app)}
                  >
                    🎊 View Offer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Activity chart ─── */}
      <div className="card chart-section">
        <div className="section-heading">
          <h3>Activity Overview</h3>
          <span className="eyebrow">This month</span>
        </div>
        <div className="chart-list">
          <div className="chart-row">
            <span>Applications Sent</span>
            <div className="chart-bar">
              <div className="chart-fill" style={{ width: applications.length > 0 ? "86%" : "5%" }} />
            </div>
          </div>
          <div className="chart-row">
            <span>Accepted</span>
            <div className="chart-bar">
              <div
                className="chart-fill"
                style={{
                  width: applications.length > 0
                    ? `${Math.round((applications.filter((a) => a.status === "Accepted").length / applications.length) * 100)}%`
                    : "5%",
                  background: "var(--accent-2)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
