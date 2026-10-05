import { Link, useLocation } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const active = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">JobSphere</Link>
      </div>

      <div className="navbar-links">
        {/* ── NO USER LOGGED IN ── */}
        {!user && (
          <>
            <Link className={active("/")} to="/">Home</Link>
            <Link className={active("/jobs")} to="/jobs">Jobs</Link>
            <Link className={active("/companies")} to="/companies">Companies</Link>
            <Link className={active("/about")} to="/about">About</Link>
            <Link className={active("/contact")} to="/contact">Contact</Link>
            <Link className="btn btn-secondary" to="/login">Login</Link>
            <Link className="btn btn-primary" to="/register">Register</Link>
          </>
        )}

        {/* ── JOB SEEKER ── */}
        {user && user.role === "jobseeker" && (
          <>
            <Link className={active("/")} to="/">Home</Link>
            <Link className={active("/jobs")} to="/jobs">🔍 Search Jobs</Link>
            <Link className={active("/jobseeker")} to="/jobseeker">📊 Dashboard</Link>
            <Link className={active("/about")} to="/about">About</Link>
            <Link className={active("/contact")} to="/contact">Contact</Link>
            <button className="btn btn-secondary" onClick={onLogout}>🚪 Logout</button>
          </>
        )}

        {/* ── RECRUITER ── */}
        {user && user.role === "recruiter" && (
          <>
            <Link className={active("/recruiter")} to="/recruiter">📊 Dashboard</Link>
            <Link className={active("/post-job")} to="/post-job">➕ Post Job</Link>
            <Link className={active("/manage-jobs")} to="/manage-jobs">💼 Manage Jobs</Link>
            <Link className={active("/contact")} to="/contact">🔔 Notifications</Link>
            <button className="btn btn-secondary" onClick={onLogout}>🚪 Logout</button>
          </>
        )}

        {/* ── ADMIN ── */}
        {user && user.role === "admin" && (
          <>
            <Link className={active("/admin")} to="/admin">📊 Dashboard</Link>
            <Link className={active("/jobs")} to="/jobs">🗂️ All Jobs</Link>
            <Link className={active("/manage-jobs")} to="/manage-jobs">💼 Manage Jobs</Link>
            <Link className={active("/applicants")} to="/applicants">👥 All Applicants</Link>
            <Link className={active("/manage-users")} to="/manage-users">👤 Manage Users</Link>
            <Link className={active("/companies")} to="/companies">🏢 Companies</Link>
            <button className="btn btn-secondary" onClick={onLogout}>🚪 Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
