import { useState } from "react";
import { Link } from "react-router-dom";

const popularCategories = [
  { title: "Software Engineer", jobs: "1,250+ jobs" },
  { title: "Business Development", jobs: "870+ jobs" },
  { title: "Customer Support", jobs: "620+ jobs" },
  { title: "Data Analyst", jobs: "510+ jobs" },
  { title: "Sales Executive", jobs: "430+ jobs" },
  { title: "HR Recruiter", jobs: "290+ jobs" },
];

const trustedCompanies = ["TCS", "Infosys", "Wipro", "Accenture", "IBM", "Amazon", "HCL", "Capgemini"];

const featureData = [
  {
    id: "ai-resume-builder",
    icon: "AI",
    title: "AI Resume Builder",
    summary: "Create polished resumes instantly with smart suggestions and professional templates.",
    details:
      "The AI Resume Builder lets you build and format a professional resume. It offers: 1. Live Interactive Preview showing your formatted resume immediately. 2. Multiple Pre-loaded Demo Resumes (Best Product Designer, General Developer, and Cloud/DevOps Engineer) that you can load with a single click. 3. Section editors for profile data, Experience, Education, and Skills. 4. One-click Export to PDF/Print option.",
    action: "/apply",
  },
  {
    id: "ai-job-recommendation",
    icon: "✦",
    title: "AI Job Recommendation",
    summary: "Get role suggestions based on your skills, location, and career interests.",
    details:
      "Get automated role recommendations powered by machine learning matching. Features: 1. Real-time skill matching against active postings. 2. Location-based and preference-based filtering. 3. Personalized career track recommendations based on profile completion.",
    action: "/jobs",
  },
  {
    id: "top-companies",
    icon: "◼",
    title: "Top Companies",
    summary: "Browse leading employers and discover trending roles from trusted organizations.",
    details:
      "Browse hiring partners and top industry companies in India. Highlights: 1. Deep profiles of partner firms (Infosys, TCS, Wipro, Tech Mahindra, Accenture, Microsoft). 2. Filter listings specifically by companies. 3. Insights on company culture, average salary ranges, and growth opportunities.",
    action: "/jobs",
  },
  {
    id: "latest-jobs",
    icon: "↺",
    title: "Latest Jobs",
    summary: "Stay updated with the newest openings added to the platform every day.",
    details:
      "Explore the newest job listings posted in the last 24 hours. Highlights: 1. Instant notifications for matching roles. 2. Daily updates from verified recruiters. 3. Sort openings by creation date to apply early.",
    action: "/jobs",
  },
  {
    id: "featured-jobs",
    icon: "★",
    title: "Featured Jobs",
    summary: "Explore handpicked roles that stand out for growth, pay, and reputation.",
    details:
      "Premium listings handpicked for high career growth, compensation, and team culture. Highlights: 1. Highlighted postings with top visibility. 2. Direct applications to key recruiter roles. 3. Verified compensation ranges.",
    action: "/jobs",
  },
  {
    id: "career-tips",
    icon: "💡",
    title: "Career Tips",
    summary: "Learn practical guidance for interviews, growth, and smart job search strategies.",
    details:
      "Actionable advice to scale your career, build a strong personal brand, and improve search strategy. Topics: 1. How to optimize your LinkedIn profile and resume keywords. 2. Networking strategies to find unadvertised job openings. 3. Developing soft skills and preparing for technical reviews.",
    action: "/about",
  },
  {
    id: "interview-preparation",
    icon: "🎤",
    title: "Interview Preparation",
    summary: "Prepare for common questions and sharpen your confidence before interviews.",
    details:
      "Comprehensive guides to excel in your next job interview. Resources: 1. Coding and technical question banks. 2. Behavioural question templates (STAR method). 3. Live mock interview tips and common mistakes to avoid.",
    action: "/about",
  },
  {
    id: "salary-calculator",
    icon: "$",
    title: "Salary Calculator",
    summary: "Estimate salary ranges for roles and compare compensation expectations quickly.",
    details:
      "Our live Monthly Salary & Tax Estimator is fully functional. Features: 1. Input your Annual CTC to instantly view monthly take-home salary. 2. Choose between the New Tax Regime (lower tax slabs without exemptions) or the Old Tax Regime. 3. Adjust Basic Salary and HRA configurations. 4. Interactive sliders for dynamic calculations. 5. View complete deductions (EPF, PT, Income Tax/TDS) and your Take-home Ratio.",
    action: "/salary-calculator",
  },
];


const Home = ({ user }) => {
  const [selectedFeature, setSelectedFeature] = useState(featureData[0]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openFeatureModal = (feature) => {
    setSelectedFeature(feature);
    setShowModal(true);
  };

  return (
    <div className="page-container">
      <section className="hero">
        <div className="hero-copy">
          <h1>Discover Jobs Faster with Smart Matching</h1>
          <p>
            JobSphere helps recruiters, applicants, and teams connect with the right roles.
            Browse curated listings, post jobs, and manage applications with a modern workflow.
          </p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Search jobs, skills, or companies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link className="btn btn-primary" to={`/jobs?search=${encodeURIComponent(searchQuery)}`}>
              Search
            </Link>
          </div>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/jobs">
              Browse Jobs
            </Link>
            {!user && (
              <Link className="btn btn-secondary" to="/login">
                Sign In / Register
              </Link>
            )}
          </div>

        </div>

        <div className="hero-visual">
          {/* small heading near the right-side cards (follows arrow) */}
          <div style={{ alignSelf: 'start', marginBottom: '0.5rem' }}>
            <h3 className="hero-follow-heading">Discovering Jobs</h3>
            <p className="muted" style={{ margin: 0 }}>Active roles and companies curated for you</p>
          </div>

          <div className="hero-banner" style={{ alignSelf: 'start' }}>
            <div className="banner-card">
              <h3>300+</h3>
              <p>Active jobs ready to apply for right now.</p>
            </div>
            <div className="banner-card">
              <h3>120+</h3>
              <p>Recruiters and companies posting new roles every day.</p>
            </div>
            <div className="banner-card">
              <h3>4.9/5</h3>
              <p>Trusted workflow for fast hiring and simple applicant tracking.</p>
            </div>
          </div>

          {/* additional content on the right side: featured quick links */}
          <div style={{ marginTop: '1.25rem' }}>
            <div className="banner-card" style={{ marginBottom: '0.75rem' }}>
              <h3>Featured</h3>
              <p>AI Resume Builder • Job Recommendations</p>
            </div>
            <div className="banner-card">
              <h3>Top Companies</h3>
              <p>TCS, Infosys, Wipro, Accenture, IBM</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-quick-links">
        <div className="home-section-header">
          <div>
            <p className="section-eyebrow">Popular Categories</p>
            <h2>Jobs people are searching for right now</h2>
          </div>
          <Link className="text-link" to="/jobs">
            View all jobs
          </Link>
        </div>

        <div className="home-category-grid">
          {popularCategories.map((category) => (
            <Link key={category.title} className="category-pill" to="/jobs">
              <span>{category.title}</span>
              <small>{category.jobs}</small>
            </Link>
          ))}
        </div>

        <div className="home-company-row">
          <span className="company-row-label">Top companies hiring</span>
          <div className="company-strip">
            {trustedCompanies.map((company) => (
              <span key={company} className="company-chip">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        {featureData.map((feature) => (
          <button
            key={feature.id}
            type="button"
            className={`feature-card ${selectedFeature.id === feature.id ? "feature-selected" : ""}`}
            onClick={() => openFeatureModal(feature)}
          >
            <span className="feature-icon">{feature.icon}</span>
            <h2>{feature.title}</h2>
            <p>{feature.summary}</p>
          </button>
        ))}
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <div className="modal-icon">{selectedFeature.icon}</div>
            <h2>{selectedFeature.title}</h2>
            <p>{selectedFeature.details}</p>
            <Link
              className="btn btn-primary"
              to={selectedFeature.action}
              onClick={() => setShowModal(false)}
            >
              {selectedFeature.title.includes("Register") ? "Get Started" : "Learn More"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
