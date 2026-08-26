function KPICard({ title, value }) {
  return (
    <div className="kpi-card">

      <h3>
        {title}
      </h3>

      <div className="kpi-value">
        {value}
      </div>

    </div>
  );
}

export default KPICard;