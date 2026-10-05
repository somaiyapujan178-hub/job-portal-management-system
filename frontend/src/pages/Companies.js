import { Link } from "react-router-dom";

const featuredCompanies = [
  { name: "Infosys Limited", location: "Bengaluru, India", jobs: "120+ active roles" },
  { name: "Tata Consultancy Services", location: "Mumbai, India", jobs: "95+ active roles" },
  { name: "Wipro Limited", location: "Hyderabad, India", jobs: "84+ active roles" },
  { name: "Tech Mahindra Limited", location: "Pune, India", jobs: "71+ active roles" },
  { name: "Accenture Solutions Pvt. Ltd.", location: "Gurgaon, India", jobs: "68+ active roles" },
  { name: "Microsoft India Pvt. Ltd.", location: "Noida, India", jobs: "54+ active roles" },
];

const Companies = () => {
  return (
    <div className="page-container">
      <section className="company-section company-page">
        <div className="section-title-row">
          <div>
            <h2>Featured Companies</h2>
            <p className="section-subtitle">Browse leading employers and discover the right opportunity for your next move.</p>
          </div>
          <Link className="btn btn-primary" to="/jobs">
            Explore Jobs
          </Link>
        </div>
        <div className="company-grid">
          {featuredCompanies.map((company) => (
            <div key={company.name} className="company-card">
              <h3>{company.name}</h3>
              <p>{company.location}</p>
              <span>{company.jobs}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Companies;
