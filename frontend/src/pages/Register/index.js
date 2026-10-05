import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState("");
  const [message, setMessage] = useState("");

  const handleNext = () => {
    setMessage("");
    if (step === 1 && (!name || !email || !password)) {
      setMessage("Please fill in your personal details first.");
      return;
    }
    if (step === 2 && !education) {
      setMessage("Please enter your education details.");
      return;
    }
    if (step === 3 && !skills) {
      setMessage("Please add at least one skill.");
      return;
    }
    setStep((current) => current + 1);
  };

  const handleBack = () => {
    setMessage("");
    setStep((current) => current - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!name || !email || !password || !education || !skills) {
      setMessage("Please complete the required fields before submitting.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ""}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, education, skills, resume }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      onRegister(data);
      navigate("/jobs");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,420px) minmax(820px,1100px) minmax(280px,420px)', gap: '1.25rem', alignItems: 'start', padding: '1rem 0' }}>
        {/* left quick info - use space for benefits or an illustration */}
        <div style={{ gridColumn: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="false">
          <div className="hero-illustration-card" style={{ width: '100%', maxWidth: '360px', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'var(--muted-2)', textAlign: 'center', padding: '1rem' }}>
              <h4 style={{ margin: 0, color: 'var(--primary-light)' }}>Make your profile stand out</h4>
              <ul style={{ textAlign: 'left', marginTop: '0.75rem', paddingLeft: '1rem' }}>
                <li>Complete profile for better matches</li>
                <li>Upload resume to increase visibility</li>
                <li>Showcase skills and experience</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card auth-card register-card" style={{ gridColumn: '2', width: '100%', maxWidth: '1100px' }}>
          <div className="register-steps">
          <div className={`step-pill ${step >= 1 ? "active" : ""}`}>1. Personal Details</div>
          <div className={`step-pill ${step >= 2 ? "active" : ""}`}>2. Education</div>
          <div className={`step-pill ${step >= 3 ? "active" : ""}`}>3. Skills</div>
          <div className={`step-pill ${step >= 4 ? "active" : ""}`}>4. Resume Upload</div>
        </div>

        <h2>Create Account</h2>
        <p className="auth-subtitle">Complete the form step by step to build your profile.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <label>
                Full Name
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <label>
                Role
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="jobseeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </>
          )}

          {step === 2 && (
            <label>
              Education
              <input
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Tech in Computer Science"
                required
              />
            </label>
          )}

          {step === 3 && (
            <label>
              Skills
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows="4"
                placeholder="e.g. React, Node.js, UI/UX"
                required
              />
            </label>
          )}

          {step === 4 && (
            <label>
              Resume Upload
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0]?.name || "")}
              />
            </label>
          )}

          <div className="register-actions">
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                Back
              </button>
            )}

            {step < 4 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button className="btn btn-primary" type="submit">
                Complete Registration
              </button>
            )}
          </div>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>

      {/* right quick links / highlights */}
      <div style={{ gridColumn: '3', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }} aria-hidden="false">
        <div style={{ width: '100%', maxWidth: '360px', display: 'grid', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <h4 style={{ marginTop: 0 }}>Quick Links</h4>
            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
              <li><button className="link-button" onClick={() => navigate('/jobs')}>Browse Jobs</button></li>
              <li><button className="link-button" onClick={() => navigate('/login')}>Back to Login</button></li>
              <li><button className="link-button" onClick={() => navigate('/contact')}>Contact Support</button></li>
            </ul>
          </div>

          <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ marginTop: 0 }}>Tips</h4>
            <div style={{ fontSize: '0.95rem', color: 'var(--muted-2)' }}>
              Complete all steps for better job matches. Add at least 3 skills for improved recommendations.
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Register;
