import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import LoadingState from "./components/LoadingState";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import JobSeeker from "./pages/JobSeeker";
import Recruiter from "./pages/Recruiter";
import Admin from "./pages/Admin";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
import Companies from "./pages/Companies";
import SalaryCalculator from "./pages/SalaryCalculator";
import Contact from "./pages/Contact";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("jobPortalUser");
    if (stored) setUser(JSON.parse(stored));
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("jobPortalUser", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("jobPortalUser");
    setUser(null);
  };

  // Role-based redirect after login
  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "recruiter") return "/recruiter";
    return "/jobseeker";
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          {loading ? (
            <div className="app-transition">
              <LoadingState />
            </div>
          ) : (
            <div className="app-transition app-transition-enter">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home user={user} />} />
                <Route path="/jobs" element={<Jobs user={user} />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/about" element={<About />} />
                <Route path="/jobs/:id" element={<JobDetails user={user} />} />
                <Route path="/login" element={user ? <Navigate to={getDashboardPath()} /> : <Login onLogin={handleLogin} />} />
                <Route path="/register" element={user ? <Navigate to={getDashboardPath()} /> : <Register onRegister={handleLogin} />} />
                <Route path="/salary-calculator" element={<SalaryCalculator />} />
                <Route path="/contact" element={<Contact />} />

                {/* Job Seeker routes */}
                <Route
                  path="/jobseeker"
                  element={user && user.role === "jobseeker" ? <JobSeeker user={user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/apply"
                  element={user && user.role === "jobseeker" ? <ApplyJob user={user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/applications"
                  element={user ? <Applications user={user} /> : <Navigate to="/login" />}
                />

                {/* Recruiter routes */}
                <Route
                  path="/recruiter"
                  element={user && (user.role === "recruiter") ? <Recruiter user={user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/post-job"
                  element={user && (user.role === "recruiter" || user.role === "admin") ? <PostJob user={user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/manage-jobs"
                  element={user && (user.role === "recruiter" || user.role === "admin") ? <Recruiter user={user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/applicants"
                  element={user && (user.role === "recruiter" || user.role === "admin") ? <Recruiter user={user} /> : <Navigate to="/login" />}
                />

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={user && user.role === "admin" ? <Admin user={user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/manage-users"
                  element={user && user.role === "admin" ? <Admin user={user} /> : <Navigate to="/login" />}
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
