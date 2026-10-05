const JobCard = ({ job }) => {
  if (!job) return null;

  return (
    <div className="job-card">
      <div className="job-card-top">
        {job.type && <span className="job-tag">{job.type}</span>}
        <span className="job-company">{job.company}</span>
      </div>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <div className="job-metadata">
        <span>{job.location}</span>
        <span>{job.salary}</span>
      </div>
    </div>
  );
};

export default JobCard;
