import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getProductionData } from "../services/cropService";

function HistoricalTrend() {
  const [data, setData] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [metric, setMetric] = useState("production");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductionData();

        const totalSeasonData = response.filter(
          (item) => item.season === "Total"
        );

        const uniqueCrops = [
          ...new Set(totalSeasonData.map((item) => item.crop)),
        ].sort();

        setCrops(uniqueCrops);
        setData(totalSeasonData);

        if (!uniqueCrops.includes("Rice") && uniqueCrops.length > 0) {
          setSelectedCrop(uniqueCrops[0]);
        }
      } catch (err) {
        console.error("Historical Trend Error:", err);
        setError(err.message || "Failed to load historical trend data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const chartData = data
    .filter((item) => item.crop === selectedCrop)
    .sort((a, b) => a.year - b.year)
    .map((item) => ({
      year: `${item.year}-${String(item.year + 1).slice(-2)}`,
      value: Number(item[metric] || 0),
    }));

  const metricLabel = {
    area: "Area",
    production: "Production",
    yield_value: "Yield",
  };

  if (loading) {
    return (
      <div className="historical-trend">
        <p>Loading historical trend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historical-trend">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="historical-trend">

      <div className="historical-trend-header">

        <div>
          

          <p>
            {selectedCrop} — {metricLabel[metric]}
          </p>
        </div>

        <div className="historical-trend-controls">

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {crops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>

          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            <option value="area">Area</option>
            <option value="production">Production</option>
            <option value="yield_value">Yield</option>
          </select>

        </div>

      </div>

      <div className="historical-trend-chart">

        <ResponsiveContainer width="100%" height={350}>

          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="year" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default HistoricalTrend;