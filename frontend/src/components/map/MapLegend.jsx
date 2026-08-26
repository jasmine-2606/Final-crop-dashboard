export default function MapLegend({ selectedCrop = "Rice" }) {
  return (
    <div className="map-legend">
      <div className="map-legend-title">
        {selectedCrop.toUpperCase()} (ACRES)
      </div>

      <div className="map-legend-item">
        <span className="legend-dot legend-high"></span>
        <span>200,000+</span>
      </div>

      <div className="map-legend-item">
        <span className="legend-dot legend-medium-high"></span>
        <span>100,000–200,000</span>
      </div>

      <div className="map-legend-item">
        <span className="legend-dot legend-medium"></span>
        <span>50,000–100,000</span>
      </div>

      <div className="map-legend-item">
        <span className="legend-dot legend-low-medium"></span>
        <span>10,000–50,000</span>
      </div>

      <div className="map-legend-item">
        <span className="legend-dot legend-low"></span>
        <span>&lt;10,000</span>
      </div>

      <div className="map-legend-item">
        <span className="legend-dot legend-no-data"></span>
        <span>No Data</span>
      </div>
    </div>
  );
}
