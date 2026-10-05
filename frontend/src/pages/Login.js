import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!email || !password || (mode === "register" && !name)) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const baseUrl = process.env.REACT_APP_API_URL || "";
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Authentication failed.");
        return;
      }

      onLogin(data);
      navigate("/jobs");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    }
  };

  const toggleMode = () => {
    setMode((current) => (current === "login" ? "register" : "login"));
    setMessage("");
  };

  return (
    <div className="page-container">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,420px) minmax(760px,1000px) minmax(280px,420px)', gap: '1.25rem', alignItems: 'start', padding: '1rem 0' }}>
        {/* left quick info - use the space for a small illustration or benefits list */}
        <div style={{ gridColumn: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="false">
          <div className="hero-illustration-card" style={{ width: '100%', maxWidth: '360px', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'var(--muted-2)', textAlign: 'center', padding: '1rem' }}>
              <h4 style={{ margin: 0, color: 'var(--primary-light)' }}>Why join JobSphere?</h4>
              <ul style={{ textAlign: 'left', marginTop: '0.75rem', paddingLeft: '1rem' }}>
                <li>Personalized job matches</li>
                <li>Fast applications</li>
                <li>Trusted recruiters</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card auth-card" style={{ gridColumn: '2', width: '100%', maxWidth: '960px' }}>
          <h2>{mode === "login" ? "Login" : "Register"}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
          {mode === "register" && (
            <label>
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button className="btn btn-primary" type="submit">
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <p className="auth-toggle">
          {mode === "login" ? (
            <>
              New here? <button className="link-button" onClick={toggleMode}>Register now</button>
            </>
          ) : (
            <>
              Already have an account? <button className="link-button" onClick={toggleMode}>Login here</button>
            </>
          )}
        </p>
        {message && <p className="form-message">{message}</p>}
      </div>

      {/* right quick links / stats */}
      <div style={{ gridColumn: '3', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }} aria-hidden="false">
        <div style={{ width: '100%', maxWidth: '360px', display: 'grid', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <h4 style={{ marginTop: 0 }}>Quick Links</h4>
            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
              <li><button className="link-button" onClick={() => navigate('/jobs')}>Browse Jobs</button></li>
              <li><button className="link-button" onClick={() => navigate('/contact')}>Contact Support</button></li>
              <li><button className="link-button" onClick={() => navigate('/register')}>Create Account</button></li>
            </ul>
          </div>

          <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ marginTop: 0 }}>Site Highlights</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center' }}>
                <strong>1.2K</strong>
                <div style={{ fontSize: '0.85rem' }}>Openings</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <strong>800+</strong>
                <div style={{ fontSize: '0.85rem' }}>Companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
