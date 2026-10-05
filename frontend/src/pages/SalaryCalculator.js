import { useState } from "react";

const SalaryCalculator = () => {
  const [annualCTC, setAnnualCTC] = useState(1500000); // 15 Lakhs default as requested (15 LPA)

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const monthlySalary = Math.round(annualCTC / 12);

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
      <div className="card" style={{ maxWidth: "480px", width: "100%", padding: "2.5rem", background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "1.25rem", textAlign: "center" }}>
        
        <h2 style={{ marginBottom: "0.5rem" }}>Salary Calculator</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "2rem" }}>
          Enter your Annual CTC to calculate your monthly salary.
        </p>

        <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gap: "1.5rem" }}>
          <label style={{ display: "grid", gap: "0.75rem", textAlign: "left", fontSize: "1rem", color: "#f1f5f9" }}>
            Annual CTC (INR)
            <input
              type="number"
              value={annualCTC}
              onChange={(e) => setAnnualCTC(Number(e.target.value))}
              placeholder="e.g. 1500000"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "0.5rem",
                color: "#fff",
                fontSize: "1.1rem",
                outline: "none"
              }}
            />
          </label>
        </form>

        <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <span style={{ fontSize: "0.9rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Monthly Salary
          </span>
          <h1 style={{ color: "#34d399", fontSize: "3rem", margin: "0.5rem 0 0" }}>
            {formatCurrency(monthlySalary)}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
