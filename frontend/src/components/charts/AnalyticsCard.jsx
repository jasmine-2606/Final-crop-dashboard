function AnalyticsCard({ title, value, children }) {
  return (
    <div className="analytics-card">
      <h3>{title}</h3>

      {children ? (
        <div className="analytics-content">
          {children}
        </div>
      ) : (
        <div className="analytics-value">
          {value}
        </div>
      )}
    </div>
  );
}

export default AnalyticsCard;