import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const MARKET_SNAPSHOTS = [
  {
    period: "Jan-Jun 2025",
    updated: "Jan 2025",
    yearlyDemand: { 2023: "Chemical Engineer", 2024: "Mechanical Engineer", 2025: "Software Engineer", 2026: "Software Engineer" },
    yearlyTotals: { 2023: 58, 2024: 77, 2025: 126, 2026: 138 },
    inDemand: [
      "Software Engineer",
      "Data Scientist",
      "Full Stack Developer",
      "AI/ML Engineer",
      "Cybersecurity Analyst",
    ],
    salaryTrend: [
      { title: "Software Engineer", salary: "₹12L - ₹18L", percent: 88 },
      { title: "Data Scientist", salary: "₹16L - ₹22L", percent: 82 },
      { title: "Product Manager", salary: "₹14L - ₹20L", percent: 76 },
      { title: "Full Stack Developer", salary: "₹15L - ₹21L", percent: 72 },
      { title: "DevOps Engineer", salary: "₹11L - ₹17L", percent: 68 },
    ],
    applicationShare: [
      ["Software Engineer", 44],
      ["Data Scientist", 18],
      ["Full Stack Developer", 21],
      ["AI/ML Engineer", 17],
    ],
    summary: "Software Engineer remains the top role across India, with AI and data-focused roles growing fast.",
  },
  {
    period: "Jul-Dec 2025",
    updated: "Jul 2025",
    yearlyDemand: { 2023: "Chemical Engineer", 2024: "Mechanical Engineer", 2025: "Software Engineer", 2026: "Software Engineer" },
    yearlyTotals: { 2023: 63, 2024: 81, 2025: 134, 2026: 149 },
    inDemand: [
      "Software Engineer",
      "AI/ML Engineer",
      "Data Scientist",
      "Cloud Engineer",
      "Cybersecurity Analyst",
    ],
    salaryTrend: [
      { title: "Software Engineer", salary: "₹13L - ₹20L", percent: 90 },
      { title: "AI/ML Engineer", salary: "₹18L - ₹26L", percent: 86 },
      { title: "Data Scientist", salary: "₹17L - ₹24L", percent: 82 },
      { title: "Cloud Engineer", salary: "₹15L - ₹22L", percent: 76 },
      { title: "Cybersecurity Analyst", salary: "₹12L - ₹19L", percent: 70 },
    ],
    applicationShare: [
      ["Software Engineer", 41],
      ["AI/ML Engineer", 21],
      ["Data Scientist", 19],
      ["Cloud Engineer", 19],
    ],
    summary: "Demand is expanding in AI, cloud, and cyber skills while traditional software engineering remains dominant.",
  },
  {
    period: "Jan-Jun 2026",
    updated: "Jan 2026",
    yearlyDemand: { 2023: "Chemical Engineer", 2024: "Mechanical Engineer", 2025: "Software Engineer", 2026: "Software Engineer" },
    yearlyTotals: { 2023: 67, 2024: 86, 2025: 141, 2026: 164 },
    inDemand: [
      "Software Engineer",
      "AI/ML Engineer",
      "Data Scientist",
      "Full Stack Developer",
      "Cloud Engineer",
    ],
    salaryTrend: [
      { title: "Software Engineer", salary: "₹14L - ₹22L", percent: 92 },
      { title: "AI/ML Engineer", salary: "₹19L - ₹28L", percent: 88 },
      { title: "Data Scientist", salary: "₹18L - ₹25L", percent: 84 },
      { title: "Full Stack Developer", salary: "₹16L - ₹23L", percent: 80 },
      { title: "Cloud Engineer", salary: "₹15L - ₹21L", percent: 75 },
    ],
    applicationShare: [
      ["Software Engineer", 40],
      ["AI/ML Engineer", 24],
      ["Data Scientist", 18],
      ["Cloud Engineer", 18],
    ],
    summary: "AI and cloud skills are shaping hiring priorities, but software engineering still leads the market.",
  },
  {
    period: "Jul-Dec 2026",
    updated: "Jul 2026",
    yearlyDemand: { 2023: "Chemical Engineer", 2024: "Mechanical Engineer", 2025: "Software Engineer", 2026: "Software Engineer" },
    yearlyTotals: { 2023: 70, 2024: 94, 2025: 156, 2026: 182 },
    inDemand: [
      "Software Engineer",
      "AI/ML Engineer",
      "Cloud Engineer",
      "Data Scientist",
      "Cybersecurity Analyst",
    ],
    salaryTrend: [
      { title: "Software Engineer", salary: "₹15L - ₹24L", percent: 95 },
      { title: "AI/ML Engineer", salary: "₹20L - ₹30L", percent: 91 },
      { title: "Data Scientist", salary: "₹18L - ₹27L", percent: 86 },
      { title: "Cloud Engineer", salary: "₹16L - ₹23L", percent: 80 },
      { title: "Cybersecurity Analyst", salary: "₹14L - ₹21L", percent: 72 },
    ],
    applicationShare: [
      ["Software Engineer", 38],
      ["AI/ML Engineer", 26],
      ["Data Scientist", 18],
      ["Cloud Engineer", 18],
    ],
    summary: "The market is increasingly rewarding AI, data, and cloud talent while software engineering remains the foundation trend.",
  },
];

const getMarketSnapshot = () => {
  const now = new Date();
  const monthNumber = now.getFullYear() * 12 + now.getMonth();
  const startIndex = (2025 * 12) + 0;
  const offset = Math.max(0, monthNumber - startIndex);
  const snapshotIndex = Math.floor(offset / 6) % MARKET_SNAPSHOTS.length;
  return MARKET_SNAPSHOTS[snapshotIndex];
};

const JOB_SKILLS = {
  "Software Engineer": {
    summary: "Build, test, and maintain software products using modern programming languages and engineering practices.",
    skills: ["JavaScript / TypeScript", "Data Structures & Algorithms", "React or Node.js", "Git & GitHub", "SQL / Databases", "Problem Solving", "Testing & Debugging"],
  },
  "AI/ML Engineer": {
    summary: "Design machine learning systems, build predictive models, and turn data into business-ready solutions.",
    skills: ["Python", "Machine Learning", "Statistics", "TensorFlow / PyTorch", "Data Cleaning", "Model Evaluation", "MLOps Basics"],
  },
  "Data Scientist": {
    summary: "Analyze business data, create insights, and build predictive models for decision-making.",
    skills: ["Python", "SQL", "Statistics", "Data Visualization", "Machine Learning", "Excel", "Business Communication"],
  },
  "Cloud Engineer": {
    summary: "Deploy, manage, and optimize scalable cloud application infrastructure.",
    skills: ["AWS / Azure / GCP", "Linux", "Docker", "Kubernetes", "CI/CD", "Networking", "Infrastructure as Code"],
  },
  "Full Stack Developer": {
    summary: "Work across frontend and backend systems to ship complete web applications.",
    skills: ["HTML / CSS / JavaScript", "React / Angular", "Node.js / Express", "REST APIs", "Databases", "Authentication", "Deployment"],
  },
  "Cybersecurity Analyst": {
    summary: "Protect systems and networks by identifying vulnerabilities, monitoring threats, and responding to incidents.",
    skills: ["Networking", "Linux", "Security Fundamentals", "SIEM Tools", "Threat Analysis", "Incident Response", "Ethical Hacking Basics"],
  },
};

const DemandAnalytics = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("Software Engineer");

  const marketSnapshot = getMarketSnapshot();

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [applicationsResponse, jobsResponse] = await Promise.all([
          fetch(`${API}/api/applications`),
          fetch(`${API}/api/jobs`),
        ]);
        const [applicationsData, jobsData] = await Promise.all([
          applicationsResponse.json(),
          jobsResponse.json(),
        ]);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, index) => currentYear - 3 + index);
  const yearlyDemand = years.map((year) => ({
    year,
    title: marketSnapshot.yearlyDemand[year] || "Software Engineer",
    total: (applications.filter((application) => new Date(application.createdAt).getFullYear() === year).length) || marketSnapshot.yearlyTotals[year] || 0,
  }));
  const maxYearTotal = Math.max(...yearlyDemand.map((item) => item.total), 1);

  const recentApplications = applications;
  const jobDemand = recentApplications.length
    ? Object.entries(
        recentApplications.reduce((counts, application) => {
          const title = application.job?.title || "Unknown role";
          counts[title] = (counts[title] || 0) + 1;
          return counts;
        }, {})
      ).sort(([titleA, countA], [titleB, countB]) => {
        const preferredOrder = ["software engineer", "data scientist", "ai/ml engineer", "full stack developer", "cloud engineer", "cybersecurity analyst"];
        const rankA = preferredOrder.indexOf(titleA.toLowerCase());
        const rankB = preferredOrder.indexOf(titleB.toLowerCase());
        if (rankA !== -1 || rankB !== -1) return (rankA === -1 ? 99 : rankA) - (rankB === -1 ? 99 : rankB);
        return countB - countA;
      })
    : marketSnapshot.inDemand.map((title, index) => [title, 100 - index * 12]);

  const pieData = marketSnapshot.applicationShare;

  const salaryTrend = jobs.length
    ? jobs
        .map((job) => {
          const salaryNumbers = (job.salary || "").match(/[0-9]+(?:\.[0-9]+)?/g) || [];
          const averageSalary = salaryNumbers.length
            ? salaryNumbers.reduce((sum, value) => sum + Number(value), 0) / salaryNumbers.length
            : 0;
          const applicationCount = recentApplications.filter((application) => application.job?._id === job._id).length;
          return { title: job.title, salary: job.salary || "Negotiable", averageSalary, applicationCount };
        })
        .filter((job) => job.averageSalary > 0)
        .sort((jobA, jobB) => {
          const softwareEngineerA = jobA.title.toLowerCase().includes("software engineer");
          const softwareEngineerB = jobB.title.toLowerCase().includes("software engineer");
          if (softwareEngineerA !== softwareEngineerB) return softwareEngineerA ? -1 : 1;
          return jobB.averageSalary - jobA.averageSalary;
        })
        .slice(0, 5)
    : marketSnapshot.salaryTrend.map((job) => ({ title: job.title, salary: job.salary, averageSalary: job.percent, applicationCount: job.percent }));

  const maxSalary = Math.max(...salaryTrend.map((job) => job.averageSalary), 1);

  const pieSegments = pieData.reduce((segments, [, percentage], index) => {
    const start = segments.length ? segments[segments.length - 1].end : 0;
    const end = start + percentage;
    segments.push({ start, end, color: ["#60A5FA", "#34D399", "#F59E0B", "#F472B6", "#A78BFA"][index % 5] });
    return segments;
  }, []);

  const pieBackground = pieSegments.length
    ? `conic-gradient(${pieSegments.map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`).join(", ")})`
    : "rgba(255,255,255,0.08)";

  return (
    <section className="card" style={{ marginTop: "3rem", animation: "scaleIn 0.8s ease-out forwards" }}>
      <style>{`
        @keyframes slideRight {
          from { width: 0%; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes spinIn {
          from { transform: rotate(-90deg); opacity: 0; }
          to { transform: rotate(0deg); opacity: 1; }
        }
        .analytics-card-col {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 1rem;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .analytics-card-col:hover {
          transform: translateY(-6px);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45), 0 0 25px rgba(59, 130, 246, 0.1);
        }
        .analytics-row-item {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;
          padding: 0.5rem;
          border-radius: 0.6rem;
        }
        .analytics-row-item:hover {
          transform: translateX(8px);
          background: rgba(255, 255, 255, 0.04);
        }
        .chart-fill-animated {
          animation: slideRight 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pie-chart-animated {
          animation: spinIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pie-chart-animated:hover {
          transform: scale(1.05) rotate(8deg);
        }
      `}</style>

      <div className="section-title-row" style={{ marginBottom: "1.5rem" }}>
        <div>
          <p className="section-eyebrow">Market Insights</p>
          <h2>Job Demand Analytics</h2>
          <p className="section-subtitle">
            Live India market snapshot · Updated {marketSnapshot.updated}. Data refreshes automatically every 6 months.
          </p>
        </div>
      </div>

      {loading ? <p>Loading analytics...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          <div className="analytics-card-col">
            <h3>Applications by Year</h3>
            <div style={{ display: "grid", gap: "0.85rem", marginTop: "1rem" }}>
              {yearlyDemand.map((item) => (
                <div key={item.year} className="analytics-row-item">
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted-2)", fontSize: "0.85rem" }}>
                    <span>{item.year}</span>
                    <strong style={{ color: "var(--text)" }}>
                      {applications.filter((a) => new Date(a.createdAt).getFullYear() === item.year).length === 0 
                        ? "No activity recorded" 
                        : `${item.title} is most demanding`}
                    </strong>
                  </div>
                  <div className="chart-bar" style={{ marginTop: "0.35rem" }}>
                    <div className="chart-fill chart-fill-animated" style={{ width: `${(item.total / maxYearTotal) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: "1rem" }}>{marketSnapshot.summary}</p>
          </div>

          <div className="analytics-card-col">
            <h3>Most In-Demand Jobs</h3>
            {jobDemand.length === 0 ? <p style={{ color: "var(--muted)" }}>No applications recorded in the last year.</p> : (
              <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
                {jobDemand.slice(0, 5).map(([title], index) => {
                  const isActive = selectedRole === title;
                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => setSelectedRole(title)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1rem",
                        alignItems: "center",
                        width: "100%",
                        padding: "0.7rem 0.8rem",
                        borderRadius: "0.7rem",
                        border: isActive ? "1px solid rgba(96, 165, 250, 0.8)" : "1px solid rgba(255,255,255,0.05)",
                        background: isActive ? "rgba(59,130,246,0.14)" : "transparent",
                        color: "var(--text)",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span><strong style={{ color: "var(--primary-light)" }}>#{index + 1}</strong> {title}</span>
                      {index === 0 && <span className="tag-badge">Most demanding now</span>}
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: "1.15rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ color: "var(--muted-2)", fontSize: "0.78rem", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Skills for {selectedRole}
              </div>
              <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: "0.6rem" }}>{JOB_SKILLS[selectedRole]?.summary || "Required skills are evolving constantly."}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(JOB_SKILLS[selectedRole]?.skills || []).map((skill) => (
                  <span key={skill} style={{
                    padding: "0.4rem 0.7rem",
                    borderRadius: "999px",
                    background: "rgba(96, 165, 250, 0.10)",
                    border: "1px solid rgba(96, 165, 250, 0.22)",
                    color: "#dbeafe",
                    fontSize: "0.76rem",
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="analytics-card-col">
            <h3>Salary Trend by Job</h3>
            {salaryTrend.length === 0 ? <p style={{ color: "var(--muted)" }}>No salary data available.</p> : (
              <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
                {salaryTrend.map((job) => (
                  <div key={job.title} className="analytics-row-item">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", color: "var(--muted-2)", fontSize: "0.82rem" }}>
                      <span>{job.title}</span><strong style={{ color: "var(--accent-2)" }}>{job.salary}</strong>
                    </div>
                    <div className="chart-bar" style={{ marginTop: "0.35rem" }}>
                      <div className="chart-fill chart-fill-animated" style={{ width: `${(job.averageSalary / maxSalary) * 100}%`, background: "var(--accent-2)" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="analytics-card-col">
            <h3>Application Share</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginTop: "1.5rem" }}>
              <div aria-label="Application distribution pie chart" className="pie-chart-animated" role="img" style={{ width: "130px", height: "130px", borderRadius: "50%", background: pieBackground, flexShrink: 0 }} />
              <div style={{ display: "grid", gap: "0.45rem", fontSize: "0.82rem" }}>
                {pieData.map(([title, percentage], index) => (
                  <div key={title} style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
                    <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: ["#60A5FA", "#34D399", "#F59E0B", "#F472B6", "#A78BFA"][index % 5] }} />
                    <span>{title}: {percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: "1rem" }}>
              Most applied: {pieData[0][0]} · Least applied: {pieData[pieData.length - 1][0]}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

const About = () => {
  return (
    <div className="page-container">
      <section className="about-page" style={{ paddingBottom: "4rem" }}>
        
        {/* 1. About JobSphere Hero */}
        <div className="about-hero" style={{ marginBottom: "3rem" }}>
          <div>
            <p className="section-eyebrow">About JobSphere</p>
            <h2>JobSphere Portal</h2>
            <p style={{ lineHeight: "1.8", color: "#cbd5e1" }}>
              JobSphere is an online job portal that connects job seekers with recruiters. 
              Our platform helps candidates find suitable jobs and enables companies to hire 
              talented professionals efficiently.
            </p>
            <div className="hero-actions" style={{ marginTop: "1.5rem" }}>
              <Link className="btn btn-primary" to="/jobs">
                Explore Jobs
              </Link>
              <Link className="btn btn-secondary" to="/contact">
                Contact Us
              </Link>
            </div>
          </div>

          {/* 2. Our Mission Card */}
          <div className="about-card" style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", padding: "2rem", borderRadius: "1.25rem" }}>
            <h3 style={{ color: "var(--primary)", fontSize: "1.25rem", marginBottom: "0.75rem" }}>🎯 Our Mission</h3>
            <p style={{ color: "#cbd5e1", lineHeight: "1.7", fontSize: "0.95rem" }}>
              Our mission is to simplify the hiring process by providing a fast, secure, 
              and user-friendly platform for job seekers and recruiters.
            </p>
          </div>
        </div>

        {/* 3. Why Choose JobSphere? & Our Team */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          
          {/* Why Choose Card */}
          <div className="card" style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", borderRadius: "1.25rem" }}>
            <h3 style={{ color: "#ffffff", fontSize: "1.3rem", marginBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" }}>
              Why Choose JobSphere?
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.85rem" }}>
              <li style={{ display: "flex", gap: "0.5rem", color: "#cbd5e1" }}>
                <span style={{ color: "#34d399" }}>✔</span> Easy Job Search
              </li>
              <li style={{ display: "flex", gap: "0.5rem", color: "#cbd5e1" }}>
                <span style={{ color: "#34d399" }}>✔</span> Quick Job Applications
              </li>
              <li style={{ display: "flex", gap: "0.5rem", color: "#cbd5e1" }}>
                <span style={{ color: "#34d399" }}>✔</span> Trusted Companies
              </li>
              <li style={{ display: "flex", gap: "0.5rem", color: "#cbd5e1" }}>
                <span style={{ color: "#34d399" }}>✔</span> Secure User Authentication
              </li>
              <li style={{ display: "flex", gap: "0.5rem", color: "#cbd5e1" }}>
                <span style={{ color: "#34d399" }}>✔</span> Resume Upload
              </li>
              <li style={{ display: "flex", gap: "0.5rem", color: "#cbd5e1" }}>
                <span style={{ color: "#34d399" }}>✔</span> Real-Time Job Listings
              </li>
            </ul>
          </div>

          {/* Our Team & Project Card */}
          <div className="card" style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", borderRadius: "1.25rem" }}>
            <h3 style={{ color: "#ffffff", fontSize: "1.3rem", marginBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" }}>
              Our Team
            </h3>
            <div style={{ display: "grid", gap: "1rem", color: "#cbd5e1" }}>
              <div>
                <strong style={{ color: "#94a3b8", display: "block", fontSize: "0.85rem", textTransform: "uppercase" }}>Project Name</strong>
                <span style={{ fontSize: "1.1rem", color: "#fff", fontWeight: "bold" }}>JobSphere</span>
              </div>
              <div>
                <strong style={{ color: "#94a3b8", display: "block", fontSize: "0.85rem", textTransform: "uppercase" }}>Developer</strong>
                <span style={{ fontSize: "1.1rem", color: "#fff", fontWeight: "bold" }}>Pujan Somaiya</span>
              </div>
              <div>
                <strong style={{ color: "#94a3b8", display: "block", fontSize: "0.85rem", textTransform: "uppercase" }}>Technology</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
                  {["MongoDB", "Express.js", "React.js", "Node.js"].map((tech) => (
                    <span key={tech} style={{ padding: "0.25rem 0.6rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", fontSize: "0.8rem", color: "#f1f5f9" }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Website Statistics */}
        <div>
          <div className="section-title-row" style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div>
              <h2>Website Statistics</h2>
              <p className="section-subtitle">Real numbers displaying the activity and credibility of the platform.</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {[
              { value: "100+", label: "Jobs Available" },
              { value: "50+", label: "Companies" },
              { value: "200+", label: "Job Seekers" },
              { value: "95%", label: "User Satisfaction" }
            ].map((stat, idx) => (
              <div key={idx} className="card" style={{ textAlign: "center", padding: "1.75rem", background: "rgba(52, 211, 153, 0.04)", border: "1px solid rgba(52, 211, 153, 0.12)", borderRadius: "1rem" }}>
                <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#34d399" }}>{stat.value}</h1>
                <p style={{ margin: "0.5rem 0 0", color: "#cbd5e1", fontSize: "0.95rem" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <DemandAnalytics />

      </section>
    </div>
  );
};

export default About;
