const alerts = [
  "🌾 Rice acreage increased in Nalgonda",
  "🌽 Maize cultivation updated in Adilabad",
  "🌱 Cotton acreage revised in Warangal",
  "🚜 Red Gram data synchronized",
  "✅ Telangana crop database updated",
];

function LiveTicker() {
  return (
    <div className="live-ticker">

      <div className="live-ticker-label">
        <span className="live-dot">●</span>
        LIVE CROP UPDATES
      </div>

      <div className="live-ticker-track">

        <div className="live-ticker-content">

  {[...alerts, ...alerts].map((alert, index) => (
    <span
      className="live-ticker-item"
      key={index}
    >
      {alert}

      <span className="ticker-separator">
        •
      </span>
    </span>
  ))}

</div>

      </div>

    </div>
  );
}

export default LiveTicker;