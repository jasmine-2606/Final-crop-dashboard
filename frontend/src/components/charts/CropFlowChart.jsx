import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function CropFlowChart({ productionData }) {
  const [chartData, setChartData] = useState([
    ["From", "To", "Weight"],
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFlowData();
  }, [productionData]);

  const loadFlowData = async () => {
    try {
      setLoading(true);

      console.log(
        "Production data for flow:",
        productionData
      );

      const flow = [["From", "To", "Weight"]];

      if (Array.isArray(productionData)) {
        productionData.slice(0, 8).forEach((item) => {

          const crop = String(
            item?.crop || ""
          ).trim();

          const season = String(
            item?.season || ""
          ).trim();

          const year = String(
            item?.year || ""
          ).trim();

          const production = Number(
            item?.production
          );

          if (
            crop &&
            season &&
            year &&
            Number.isFinite(production) &&
            production > 0
          ) {
            flow.push([
              crop,
              `${season} ${year}`,
              production,
            ]);
          }
        });
      }

      console.log(
        "Sankey flow data:",
        flow
      );

      if (flow.length <= 1) {
        setChartData([
          ["From", "To", "Weight"],
        ]);
      } else {
        setChartData(flow);
      }

      setError(null);

    } catch (err) {

      console.error(
        "Crop flow loading failed:",
        err
      );

      setError(
        "Failed to load flow chart data"
      );

    } finally {
      setLoading(false);
    }
  };

  const options = {
    height: 240,

    backgroundColor: "transparent",

    chartArea: {
      left: 10,
      top: 10,
      width: "90%",
      height: "85%",
    },

    sankey: {
      node: {
        width: 18,
        nodePadding: 12,

        label: {
          fontSize: 11,
          color: "#e2e8f0",
        },
      },

      link: {
        colorMode: "gradient",
      },
    },
  };

  if (loading) {
    return (
      <div className="flow-chart-state">
        Loading crop flow...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flow-chart-state">
        {error}
      </div>
    );
  }

  if (chartData.length <= 1) {
    return (
      <div className="flow-chart-state">
        No valid flow data available
      </div>
    );
  }

  return (
    <div className="crop-flow-chart">

      <div className="flow-chart-header">

        <h3>
          🌱 Crop Flow Analysis
        </h3>

        <span>
          Crop → Season & Year
        </span>

      </div>

      <div className="flow-chart-container">

        <Chart
          chartType="Sankey"
          width="100%"
          height="240px"
          data={chartData}
          options={options}
        />

      </div>

    </div>
  );
}

export default CropFlowChart;