import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { FiSearch, FiBriefcase, FiUsers } from "react-icons/fi";
import { BiBell } from "react-icons/bi";

const Navbar = ({ user, onLogout }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const handleBrandClick = () => { /* simplified brand click — no animation */ };

  useEffect(() => { setUnreadCount(0); }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">JobSphere</Link>
      </div>
      <div className="navbar-links">
        <NavLink end to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="nav-icon"><AiOutlineHome /></span>
          <span>Home</span>
        </NavLink>

        <NavLink to="/jobs" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="nav-icon"><FiSearch /></span>
          <span>Explore Jobs</span>
          <span className="nav-badge">New</span>
        </NavLink>

        {user && (user.role === "recruiter" || user.role === "admin") && (
          <NavLink to="/post-job" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <span className="nav-icon"><FiBriefcase /></span>
            <span>New Job Post</span>
          </NavLink>
        )}

        <NavLink to="/applications" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="nav-icon"><BiBell /></span>
          <span>Applications</span>
          {unreadCount > 0 && <span className="nav-badge count">{unreadCount}</span>}
        </NavLink>

        {user ? (
          <button className="btn btn-secondary" onClick={onLogout}>
            <span className="nav-icon"><FiUsers /></span>
            <span>Sign Out</span>
          </button>
        ) : (
          <div className="navbar-auth-actions">
            <Link className="btn btn-primary" to="/login">
              Login
            </Link>
            <Link className="btn btn-register" to="/register">
              Register
              <span className="register-popular">Popular</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
