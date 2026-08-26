function CropSelector({ selectedCrop, setSelectedCrop }) {
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

  return (
    <div className="crop-selector">
      <label className="crop-selector-label">
        CROP
      </label>

      <div className="crop-select-wrapper">
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="crop-select"
        >
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>

        <span className="crop-select-arrow">▼</span>
      </div>
    </div>
  );
}

export default CropSelector;

