function Header({
  selectedCrop,
  setSelectedCrop,
  selectedYear,
  setSelectedYear,
  selectedSeason,
  setSelectedSeason,
}) {
  const crops = [
    "Rice",
    "Jowar",
    "Maize",
    "Red Gram",
"Green Gram",
"Black Gram",
"Bengal Gram",
    "Groundnut",
    "Sunflower",
    "Chillies",
    "Onions",
    "Sugarcane",
    "Cotton",
    "Horticulture",
  ];

  const years = [
    "All",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
  ];

  const seasons = [
    "All",
    "Kharif",
    "Rabi",
    "Summer",
    "Total",
  ];

  return (
    <header className="dashboard-header">

      <div className="header-brand">

        <div className="header-title">
          🌱 TELANGANA CROP ACREAGE ANALYTICS
        </div>

        <div className="header-subtitle">
          Department of Agriculture, Government of Telangana
        </div>

      </div>

      <div className="header-controls">

        {/* CROP */}

        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="header-crop-selector"
        >
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>

        {/* YEAR */}

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="header-crop-selector"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year === "All" ? "All Years" : year}
            </option>
          ))}
        </select>

        {/* SEASON */}

        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="header-crop-selector"
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season === "All" ? "All Seasons" : season}
            </option>
          ))}
        </select>

        <div className="header-status">
          <span className="live-dot">●</span>
          Live Data
        </div>

        <div className="header-updated">
          Last updated: {new Date().toLocaleString()}
        </div>

      </div>

    </header>
  );
}

export default Header;