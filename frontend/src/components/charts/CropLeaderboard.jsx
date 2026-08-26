import { useEffect, useMemo, useState } from "react";
import { getAllCrops } from "../../services/cropService";

function CropLeaderboard({ selectedCrop }) {
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);

      const data = await getAllCrops();

      setCropData(data);
      setError(null);
    } catch (err) {
      console.error("Leaderboard loading failed:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const leaderboardData = useMemo(() => {
    const cropKey = selectedCrop
      .toLowerCase()
      .replace(/\s+/g, "_");

    return [...cropData]
      .map((item) => ({
        district: item.district,
        value: Number(item[cropKey] ?? 0),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [cropData, selectedCrop]);

  const maxValue = leaderboardData[0]?.value || 1;

  if (loading) {
    return <div className="leaderboard-state">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="leaderboard-state">{error}</div>;
  }

  if (leaderboardData.length === 0) {
    return <div className="leaderboard-state">No data available</div>;
  }

  return (
    <div className="crop-leaderboard">
      <h3 className="leaderboard-title">
        🏆 Top 10 Districts ({selectedCrop})
      </h3>

      <div className="leaderboard-list">
        {leaderboardData.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;

          return (
            <div className="leaderboard-row" key={item.district}>
              <div className="leaderboard-rank">
                {index + 1}
              </div>

              <div className="leaderboard-district">
                <div className="leaderboard-name">
                  {item.district}
                </div>

                <div className="leaderboard-bar-track">
                  <div
                    className="leaderboard-bar"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="leaderboard-value">
                {item.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CropLeaderboard;