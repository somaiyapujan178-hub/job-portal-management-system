import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!name || !email || !password) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ""}/api/auth/login`, {
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

  return (
    <div className="page-container auth-page">
      <div className="auth-panel auth-panel-left">
        <div className="auth-badge">Welcome Back!</div>
        <h2>Find your dream career.</h2>
        <p>Sign in to browse opportunities, manage applications, and keep your job search moving forward.</p>

        <div className="auth-illustration" aria-hidden="true">
          <div className="illustration-card">
            <div className="illustration-dot" />
            <div className="illustration-screen">
              <div className="illustration-line short" />
              <div className="illustration-line" />
              <div className="illustration-line" />
            </div>
            <div className="illustration-person">
              <div className="person-head" />
              <div className="person-body" />
            </div>
          </div>
        </div>
      </div>

      <div className="auth-panel auth-panel-right">
        <div className="auth-form-card">
          <h3>Login</h3>
          <p className="auth-subtitle">Access your dashboard and continue your journey.</p>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </label>
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
                autoComplete="current-password"
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
              Sign In
            </button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
