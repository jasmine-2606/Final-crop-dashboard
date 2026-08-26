export function getDistrictColor(value) {
  if (value >= 100000) return "#00ff66"; // Dark Green
  if (value >= 50000) return "#66ff33";  // Green
  if (value >= 20000) return "#ccff33";  // Light Green
  if (value >= 10000) return "#ffff00";  // Yellow
  if (value >= 5000) return "#ff9900";   // Orange
  if (value >= 1000) return "#ff6600";   // Deep Orange
  return "#ff3333";                      // Red
}