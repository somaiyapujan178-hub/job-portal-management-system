import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Clear form
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="page-container">
      <section className="about-page" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0.75rem 0" }}>
        <div className="section-title-row" style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <div>
            <p className="section-eyebrow">Get In Touch</p>
            <h2>Contact Us</h2>
            <p className="section-subtitle">Have questions or feedback? Reach out to our team below.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(760px,960px) 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
          {/* Left-side decorative fill to remove empty space */}
          <div style={{ gridColumn: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
            <div style={{ width: '100%', minHeight: '360px', borderRadius: '1.25rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.02), rgba(59,130,246,0.04))', border: '1px solid rgba(255,255,255,0.02)' }} />
          </div>
          {/* Contact Information Card */}
          <div className="card" style={{ gridColumn: '2', background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1.25rem", height: "fit-content" }}>
            <h3 style={{ marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" }}>Support Details</h3>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div>
                <h4 style={{ color: "var(--primary)", fontSize: "1.1rem", marginBottom: "0.3rem" }}>📍 Address</h4>
                <p style={{ color: "#cbd5e1", margin: 0, fontSize: "1rem" }}>Kasak Circle, Bharuch, Gujarat, India</p>
              </div>

              <div>
                <h4 style={{ color: "var(--primary)", fontSize: "1.1rem", marginBottom: "0.3rem" }}>📧 Email</h4>
                <p style={{ color: "#cbd5e1", margin: 0, fontSize: "1rem" }}>
                  <a href="mailto:support@jobsphere.com" style={{ color: "#cbd5e1", textDecoration: "none" }}>support@jobsphere.com</a>
                </p>
              </div>

              <div>
                <h4 style={{ color: "var(--primary)", fontSize: "1.1rem", marginBottom: "0.3rem" }}>📞 Phone</h4>
                <p style={{ color: "#cbd5e1", margin: 0, fontSize: "1rem" }}>
                  <a href="tel:+918401338599" style={{ color: "#cbd5e1", textDecoration: "none" }}>+91 8401338599</a>
                </p>
              </div>

              <div>
                <h4 style={{ color: "var(--primary)", fontSize: "1.1rem", marginBottom: "0.3rem" }}>🕒 Working Hours</h4>
                <p style={{ color: "#cbd5e1", margin: 0, fontSize: "1rem" }}>Monday - Saturday</p>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="card" style={{ gridColumn: '2', background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1.25rem" }}>
            <h3 style={{ marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" }}>Send a Message</h3>
             
            <form className="form-grid resume-form" onSubmit={handleSubmit} style={{ gap: "1rem" }}>
              <label style={{ display: "grid", gap: "0.5rem", color: "#f1f5f9" }}>
                Your Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="____________________"
                  required
                  style={{ background: "transparent", border: "none", borderBottom: "2px solid rgba(255,255,255,0.2)", borderRadius: 0, color: "#fff", padding: "0.5rem 0", outline: "none" }}
                />
              </label>

              <label style={{ display: "grid", gap: "0.5rem", color: "#f1f5f9" }}>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="____________________"
                  required
                  style={{ background: "transparent", border: "none", borderBottom: "2px solid rgba(255,255,255,0.2)", borderRadius: 0, color: "#fff", padding: "0.5rem 0", outline: "none" }}
                />
              </label>

              <label style={{ display: "grid", gap: "0.5rem", color: "#f1f5f9" }}>
                Subject
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="____________________"
                  required
                  style={{ background: "transparent", border: "none", borderBottom: "2px solid rgba(255,255,255,0.2)", borderRadius: 0, color: "#fff", padding: "0.5rem 0", outline: "none" }}
                />
              </label>

              <label style={{ display: "grid", gap: "0.5rem", color: "#f1f5f9" }}>
                Message
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="______________________________________________________&#13;&#10;______________________________________________________&#13;&#10;______________________________________________________"
                  rows="4"
                  required
                  style={{ background: "transparent", border: "none", borderBottom: "2px solid rgba(255,255,255,0.2)", borderRadius: 0, color: "#fff", padding: "0.5rem 0", outline: "none", resize: "none", lineHeight: "1.6" }}
                />
              </label>

              <button className="btn btn-primary" type="submit" style={{ marginTop: "0.5rem", width: "100%" }}>
                Send Message
              </button>
            </form>

            {submitted && (
              <p style={{ color: "#34d399", marginTop: "1rem", textAlign: "center", fontWeight: "bold" }}>
                ✓ Thank you! Your message has been sent successfully.
              </p>
            )}
          </div>

          {/* Right-side decorative fill to remove empty space */}
          <div style={{ gridColumn: '3', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
            <div style={{ width: '100%', minHeight: '360px', borderRadius: '1.25rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.04), rgba(16,185,129,0.02))', border: '1px solid rgba(255,255,255,0.02)' }} />
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="card" style={{ gridColumn: '1 / -1', background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1.25rem" }}>
          <h3 style={{ marginBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" }}>📍 Office Location Map</h3>
          <div style={{ width: "100%", height: "400px", borderRadius: "0.75rem", overflow: "hidden" }}>
            <iframe
              title="Google Map Office Location"
              src="https://maps.google.com/maps?q=Kasak%20Circle%2C%20Bharuch%2C%20Gujarat%2C%20India&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
