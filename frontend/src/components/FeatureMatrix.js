import React from "react";

const FEATURES = [
  { name: "Search Jobs", seeker: "✅", recruiter: "✅", admin: "✅" },
  { name: "Apply for Jobs", seeker: "✅", recruiter: "❌", admin: "❌" },
  { name: "Upload Resume", seeker: "✅", recruiter: "❌", admin: "❌" },
  { name: "Post Jobs", seeker: "❌", recruiter: "✅", admin: "✅" },
  { name: "Edit Own Jobs", seeker: "❌", recruiter: "✅", admin: "✅" },
  { name: "View Applicants", seeker: "❌", recruiter: "✅", admin: "✅" },
  { name: "Manage Users", seeker: "❌", recruiter: "❌", admin: "✅" },
  { name: "Block Users", seeker: "❌", recruiter: "❌", admin: "✅" },
  { name: "Delete Jobs", seeker: "❌", recruiter: "Own Jobs", admin: "✅" },
  { name: "Manage Companies", seeker: "❌", recruiter: "Own Company", admin: "✅" },
  { name: "Reports", seeker: "❌", recruiter: "Own Jobs", admin: "✅" },
];

const FeatureMatrix = ({ currentRole }) => {
  const renderCell = (val) => {
    if (val === "✅") {
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          borderRadius: "6px",
          background: "rgba(16, 185, 129, 0.15)",
          color: "#10B981",
          fontWeight: "bold",
          fontSize: "0.9rem"
        }}>✓</span>
      );
    }
    if (val === "❌") {
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          borderRadius: "6px",
          background: "rgba(239, 68, 68, 0.15)",
          color: "#EF4444",
          fontWeight: "bold",
          fontSize: "0.9rem"
        }}>✗</span>
      );
    }
    return (
      <span style={{
        padding: "0.25rem 0.6rem",
        borderRadius: "999px",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        color: "#cbd5e1",
        fontSize: "0.82rem",
        fontWeight: "500"
      }}>
        {val}
      </span>
    );
  };

  return (
    <div className="card" style={{ marginTop: "2rem", overflowX: "auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <p className="eyebrow">Platform Access</p>
        <h3 style={{ margin: "0 0 0.5rem 0" }}>🔑 Role Permissions Directory</h3>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.9rem" }}>
          Here is a detailed guide of what capabilities you have on the Job Portal based on your role.
        </p>
      </div>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
        minWidth: "600px"
      }}>
        <thead>
          <tr style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            <th style={{ padding: "1rem", color: "var(--muted-2)", fontWeight: "600" }}>Feature</th>
            <th style={{
              padding: "1rem",
              color: currentRole === "jobseeker" ? "var(--primary-light)" : "var(--muted-2)",
              fontWeight: currentRole === "jobseeker" ? "700" : "600",
              background: currentRole === "jobseeker" ? "rgba(59, 130, 246, 0.05)" : "transparent",
              textAlign: "center"
            }}>
              Job Seeker {currentRole === "jobseeker" && "👤"}
            </th>
            <th style={{
              padding: "1rem",
              color: currentRole === "recruiter" ? "var(--primary-light)" : "var(--muted-2)",
              fontWeight: currentRole === "recruiter" ? "700" : "600",
              background: currentRole === "recruiter" ? "rgba(59, 130, 246, 0.05)" : "transparent",
              textAlign: "center"
            }}>
              Recruiter {currentRole === "recruiter" && "💼"}
            </th>
            <th style={{
              padding: "1rem",
              color: currentRole === "admin" ? "var(--primary-light)" : "var(--muted-2)",
              fontWeight: currentRole === "admin" ? "700" : "600",
              background: currentRole === "admin" ? "rgba(59, 130, 246, 0.05)" : "transparent",
              textAlign: "center"
            }}>
              Admin {currentRole === "admin" && "🛡️"}
            </th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((feat, idx) => (
            <tr
              key={feat.name}
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                transition: "background 200ms ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent"; }}
            >
              <td style={{ padding: "0.9rem 1rem", color: "var(--text)", fontWeight: "500", fontSize: "0.92rem" }}>
                {feat.name}
              </td>
              <td style={{
                padding: "0.9rem 1rem",
                textAlign: "center",
                background: currentRole === "jobseeker" ? "rgba(59, 130, 246, 0.03)" : "transparent"
              }}>
                {renderCell(feat.seeker)}
              </td>
              <td style={{
                padding: "0.9rem 1rem",
                textAlign: "center",
                background: currentRole === "recruiter" ? "rgba(59, 130, 246, 0.03)" : "transparent"
              }}>
                {renderCell(feat.recruiter)}
              </td>
              <td style={{
                padding: "0.9rem 1rem",
                textAlign: "center",
                background: currentRole === "admin" ? "rgba(59, 130, 246, 0.03)" : "transparent"
              }}>
                {renderCell(feat.admin)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureMatrix;
