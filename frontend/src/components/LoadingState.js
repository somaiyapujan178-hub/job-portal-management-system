const LoadingState = () => {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="spinner" />
      <div className="loading-copy">
        <h3>Loading experience...</h3>
        <p>Preparing your dashboard and content.</p>
      </div>
      <div className="skeleton-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton-line long" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
