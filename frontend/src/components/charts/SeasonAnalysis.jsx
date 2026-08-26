import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getProductionData } from "../../services/cropService";

function SeasonAnalysis() {
  const [data, setData] = useState([]);
  const [crops, setCrops] = useState([]);

  const [selectedCrop, setSelectedCrop] =
    useState("Rice");

  const [metric, setMetric] =
    useState("production");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD DATASET B
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProductionData();

        if (!Array.isArray(response)) {
          throw new Error(
            "Invalid production data received"
          );
        }

        setData(response);

        // Get unique crops
        const uniqueCrops = [
          ...new Set(
            response
              .map((item) =>
                String(
                  item?.crop || ""
                ).trim()
              )
              .filter(Boolean)
          ),
        ].sort();

        setCrops(uniqueCrops);

        // Keep Rice as default if available
        if (
          uniqueCrops.length > 0 &&
          !uniqueCrops.includes("Rice")
        ) {
          setSelectedCrop(
            uniqueCrops[0]
          );
        }

      } catch (err) {
        console.error(
          "Season Analysis Error:",
          err
        );

        setError(
          err.message ||
            "Failed to load season analysis data"
        );

      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==========================================
  // SEASON CHART DATA
  // ==========================================

  const chartData = useMemo(() => {
    const seasons = [
      "Kharif",
      "Rabi",
      "Summer",
      "Total",
    ];

    return seasons.map((season) => {

      const matchingRows = data.filter(
        (item) =>
          String(
            item?.crop || ""
          ).trim() === selectedCrop &&
          String(
            item?.season || ""
          ).trim()
            .toLowerCase() ===
            season.toLowerCase()
      );

      if (
        matchingRows.length === 0
      ) {
        return {
          season,
          value: 0,
        };
      }

      // Dataset B may contain multiple
      // years for the same season.
      // Calculate the average for the
      // selected metric across available years.

      const validValues =
        matchingRows
          .map((item) =>
            Number(
              item?.[metric] || 0
            )
          )
          .filter((value) =>
            Number.isFinite(value)
          );

      const average =
        validValues.length > 0
          ? validValues.reduce(
              (sum, value) =>
                sum + value,
              0
            ) /
            validValues.length
          : 0;

      return {
        season,
        value: average,
      };
    });
  }, [
    data,
    selectedCrop,
    metric,
  ]);

  // ==========================================
  // METRIC LABEL
  // ==========================================

  const metricLabel = {
    area: "Area",
    production: "Production",
    yield_value: "Yield",
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="season-analysis">

        <div className="season-analysis-state">
          Loading season analysis...
        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="season-analysis">

        <div className="season-analysis-state">
          {error}
        </div>

      </div>
    );
  }

  // ==========================================
  // COMPONENT
  // ==========================================

  return (
    <div className="season-analysis">

      {/* HEADER */}

      <div className="season-analysis-header">

        <div>

          <h3>
            Season Analysis
          </h3>

          <p>
            {selectedCrop} —{" "}
            {metricLabel[metric]}
          </p>

        </div>

        {/* CONTROLS */}

        <div className="season-analysis-controls">

          <select
            value={selectedCrop}
            onChange={(e) =>
              setSelectedCrop(
                e.target.value
              )
            }
          >
            {crops.map((crop) => (
              <option
                key={crop}
                value={crop}
              >
                {crop}
              </option>
            ))}
          </select>

          <select
            value={metric}
            onChange={(e) =>
              setMetric(
                e.target.value
              )
            }
          >
            <option value="area">
              Area
            </option>

            <option value="production">
              Production
            </option>

            <option value="yield_value">
              Yield
            </option>
          </select>

        </div>

      </div>

      {/* CHART */}

      <div className="season-analysis-chart">

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="season"
            />

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

export default SeasonAnalysis;