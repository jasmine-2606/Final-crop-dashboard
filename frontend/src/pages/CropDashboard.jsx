import { useEffect, useMemo, useState } from "react";

import Header from "../components/Header";
import Panel from "../components/common/Panel";
import AnimatedKPICard from "../components/kpi/AnimatedKPICard";
import AnalyticsCard from "../components/charts/AnalyticsCard";
import LiveTicker from "../components/ticker/LiveTicker";
import CropSelector from "../components/common/CropSelector";
import DiversityMatrix from "../components/charts/DiversityMatrix";
import CropLeaderboard from "../components/charts/CropLeaderboard";
import CropFlowChart from "../components/charts/CropFlowChart";
import SeasonAnalysis from "../components/charts/SeasonAnalysis";
import TelanganaMap from "../components/map/TelanganaMap";
import HistoricalTrend from "../components/HistoricalTrend";

import {
  getAllCrops,
  getStateSummary,
  getProductionData,
  getProductionSummary,
} from "../services/cropService";

function CropDashboard() {
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");

  const [cropData, setCropData] = useState([]);
  const [summary, setSummary] = useState({});

  const [productionData, setProductionData] = useState([]);
  const [productionSummary, setProductionSummary] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadCropData();
  }, []);

  const loadCropData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        data,
        stateSummary,
        production,
        productionStats,
      ] = await Promise.all([
        getAllCrops(),
        getStateSummary(),
        getProductionData(),
        getProductionSummary(),
      ]);

      setCropData(data);
      setSummary(stateSummary);
      setProductionData(production);
      setProductionSummary(productionStats);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Failed to load crop data");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER DATASET B
  // Crop → Year → Season
  // ==========================================

  const filteredProductionData = useMemo(() => {
    return productionData.filter((item) => {
      const cropMatch =
        selectedCrop === "All" ||
        item.crop?.toLowerCase() ===
          selectedCrop.toLowerCase();

      const yearMatch =
        selectedYear === "All" ||
        String(item.year) ===
          String(selectedYear);

      const seasonMatch =
        selectedSeason === "All" ||
        item.season?.toLowerCase() ===
          selectedSeason.toLowerCase();

      return (
        cropMatch &&
        yearMatch &&
        seasonMatch
      );
    });
  }, [
    productionData,
    selectedCrop,
    selectedYear,
    selectedSeason,
  ]);

  // ==========================================
  // SELECTED CROP METRICS
  // ==========================================

  const selectedMetrics = useMemo(() => {
    if (filteredProductionData.length === 0) {
      return {
        area: 0,
        production: 0,
        yield: 0,
      };
    }

    const totalArea =
      filteredProductionData.reduce(
        (sum, item) =>
          sum + Number(item.area || 0),
        0
      );

    const totalProduction =
      filteredProductionData.reduce(
        (sum, item) =>
          sum +
          Number(item.production || 0),
        0
      );

    const averageYield =
      filteredProductionData.reduce(
        (sum, item) =>
          sum +
          Number(item.yield_value || 0),
        0
      ) /
      filteredProductionData.length;

    return {
      area: totalArea,
      production: totalProduction,
      yield: averageYield,
    };
  }, [filteredProductionData]);

  // ==========================================
  // CROP FIELDS
  // ==========================================

  const cropFields = [
    "rice",
    "jowar",
    "maize",
    "red_gram",
    "green_gram",
    "black_gram",
    "bengal_gram",
    "groundnut",
    "sunflower",
    "chillies",
    "onions",
    "sugarcane",
    "cotton",
    "horticulture",
  ];

  // ==========================================
  // HIGHEST CROP
  // ==========================================

  const highestCrop = useMemo(() => {
    if (
      !summary ||
      Object.keys(summary).length === 0
    ) {
      return "-";
    }

    let highest = "";
    let highestValue = 0;

    cropFields.forEach((crop) => {
      const value = Number(
        summary[crop] || 0
      );

      if (value > highestValue) {
        highestValue = value;

        highest = crop
          .replaceAll("_", " ")
          .replace(/\b\w/g, (c) =>
            c.toUpperCase()
          );
      }
    });

    return highest || "-";
  }, [summary]);

  // ==========================================
  // HIGHEST DISTRICT FOR SELECTED CROP
  // ==========================================

  const selectedCropHighestDistrict =
    useMemo(() => {
      if (cropData.length === 0) {
        return {
          district: "-",
          value: 0,
        };
      }

      const cropKey = selectedCrop
        .toLowerCase()
        .replace(/\s+/g, "_");

      const sorted = [...cropData].sort(
        (a, b) =>
          Number(b[cropKey] || 0) -
          Number(a[cropKey] || 0)
      );

      return {
        district:
          sorted[0]?.district || "-",

        value: Number(
          sorted[0]?.[cropKey] || 0
        ),
      };
    }, [cropData, selectedCrop]);

  // ==========================================
  // TOP DISTRICT
  // ==========================================

  const topDistrict = useMemo(() => {
    if (cropData.length === 0) {
      return {
        district: "-",
        value: 0,
      };
    }

    const cropKey = selectedCrop
      .toLowerCase()
      .replace(/\s+/g, "_");

    const sorted = [...cropData].sort(
      (a, b) =>
        Number(b[cropKey] || 0) -
        Number(a[cropKey] || 0)
    );

    return {
      district:
        sorted[0]?.district || "-",

      value: Number(
        sorted[0]?.[cropKey] || 0
      ),
    };
  }, [cropData, selectedCrop]);

  // ==========================================
  // SUMMARY STATISTICS
  // ==========================================

  const summaryStats = useMemo(() => {
    if (cropData.length === 0) {
      return {
        averageAcreage: 0,
        highestDistrict: "-",
        highestValue: 0,
        lowestDistrict: "-",
        lowestValue: 0,
      };
    }

    const districtTotals = cropData
      .map((district) => {
        const total =
          cropFields.reduce(
            (sum, crop) =>
              sum +
              Number(
                district[crop] || 0
              ),
            0
          );

        return {
          district:
            district.district,
          total,
        };
      })
      .filter(
        (district) =>
          district.total > 0
      );

    const sorted = [
      ...districtTotals,
    ].sort(
      (a, b) => b.total - a.total
    );

    const totalAcreage =
      districtTotals.reduce(
        (sum, district) =>
          sum + district.total,
        0
      );

    return {
      averageAcreage:
        districtTotals.length > 0
          ? totalAcreage /
            districtTotals.length
          : 0,

      highestDistrict:
        sorted[0]?.district || "-",

      highestValue:
        sorted[0]?.total || 0,

      lowestDistrict:
        sorted[
          sorted.length - 1
        ]?.district || "-",

      lowestValue:
        sorted[
          sorted.length - 1
        ]?.total || 0,
    };
  }, [cropData]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-6 text-cyan-400 text-lg font-medium">
            Loading Telangana Crop Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="bg-slate-900 border border-red-500 rounded-xl p-8 text-center shadow-lg">
          <h2 className="text-red-500 text-2xl font-bold mb-3">
            Failed to Load Dashboard
          </h2>

          <p className="text-gray-300 mb-6">
            {error}
          </p>

          <button
            onClick={loadCropData}
            className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="dashboard">

      {/* ==========================================
          HEADER
      ========================================== */}

      <Header
        selectedCrop={selectedCrop}
        setSelectedCrop={setSelectedCrop}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
      />

      {/* ==========================================
          LEFT PANEL
      ========================================== */}

      <div className="left-panel">

        <Panel
          title={`Crop Statistics — ${selectedCrop} | ${
            selectedYear === "All"
              ? "All Years"
              : selectedYear
          } | ${
            selectedSeason === "All"
              ? "All Seasons"
              : selectedSeason
          }`}
        >

          <AnimatedKPICard
            title="Total Acreage"
            value={Number(
              summary.total_acreage || 0
            ).toLocaleString()}
            subtitle="total cultivated area"
            icon="📊"
          />

          <AnimatedKPICard
            title="Highest Crop"
            value={highestCrop}
            subtitle="highest crop in Telangana"
            icon="🌱"
          />

          <AnimatedKPICard
            title="Area"
            value={selectedMetrics.area.toLocaleString()}
            subtitle="selected crop area"
            icon="📐"
          />

          <AnimatedKPICard
            title="Production"
            value={selectedMetrics.production.toLocaleString()}
            subtitle="selected crop production"
            icon="🌾"
          />

          <AnimatedKPICard
            title="Yield"
            value={selectedMetrics.yield.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              }
            )}
            subtitle="average yield"
            icon="📈"
          />

        </Panel>

      </div>

      {/* ==========================================
          CENTER PANEL
      ========================================== */}

      <div className="center-panel">

        <Panel title="Telangana Crop Map">

          <CropSelector
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
          />

          <div
            className="map-container"
            style={{
              overflow: "visible",
            }}
          >
            <div className="map-grid">

              <TelanganaMap
                selectedCrop={selectedCrop}
                cropData={cropData}
              />

            </div>
          </div>

        </Panel>

      </div>

      {/* ==========================================
          RIGHT PANEL
      ========================================== */}

      <div className="right-panel">

        <Panel title="Analytics">

          <div className="analytics-container">

            <AnalyticsCard title="🏆 Top District">

              <div className="analytics-highlight">

                <strong>
                  {topDistrict.district}
                </strong>

                <span>
                  {selectedCrop}:{" "}
                  {topDistrict.value.toLocaleString()}{" "}
                  Acres
                </span>

              </div>

            </AnalyticsCard>

            <AnalyticsCard title="🌱 Highest Crop">

              <div className="analytics-highlight">

                <strong>
                  {selectedCrop}
                </strong>

                <span>
                  District:{" "}
                  {
                    selectedCropHighestDistrict.district
                  }
                </span>

              </div>

            </AnalyticsCard>

            <AnalyticsCard title="◎ Coverage">

              <div className="analytics-highlight">

                <strong>
                  {cropData.length}
                </strong>

                <span>
                  Districts
                </span>

              </div>

            </AnalyticsCard>

            <AnalyticsCard title="● Status">

              <div className="analytics-highlight status-live">

                <strong>
                  Live
                </strong>

                <span>
                  Real-time Data
                </span>

              </div>

            </AnalyticsCard>

            <AnalyticsCard title="Crop Diversity Matrix">

              <DiversityMatrix />

            </AnalyticsCard>

            <CropLeaderboard
              selectedCrop={selectedCrop}
            />

            <AnalyticsCard title="Crop Flow Analysis">

              <CropFlowChart
                productionData={
                  filteredProductionData
                }
              />

            </AnalyticsCard>
            {/* ==========================================
    SEASON ANALYSIS — PHASE 11
========================================== */}

<AnalyticsCard title="Season Analysis">

  <SeasonAnalysis />

</AnalyticsCard>

          </div>

        </Panel>

      </div>

      {/* ==========================================
          AGRICULTURAL SUMMARY
      ========================================== */}

      <div className="bottom-summary-panel">

        <Panel title="Agricultural Summary">

          <div className="summary-cards">

            <AnalyticsCard title="Average Acreage">

              <div className="analytics-highlight">

                <strong>
                  {Math.round(
                    summaryStats.averageAcreage
                  ).toLocaleString()}
                </strong>

                <span>
                  Acres / District
                </span>

              </div>

            </AnalyticsCard>

            <AnalyticsCard title="Highest Value District">

              <div className="analytics-highlight">

                <strong>
                  {summaryStats.highestDistrict}
                </strong>

                <span>
                  {Math.round(
                    summaryStats.highestValue
                  ).toLocaleString()}{" "}
                  Acres
                </span>

              </div>

            </AnalyticsCard>

            <AnalyticsCard title="Lowest Value District">

              <div className="analytics-highlight">

                <strong>
                  {summaryStats.lowestDistrict}
                </strong>

                <span>
                  {Math.round(
                    summaryStats.lowestValue
                  ).toLocaleString()}{" "}
                  Acres
                </span>

              </div>

            </AnalyticsCard>

            <AnalyticsCard title="Data Coverage">

              <div className="analytics-highlight">

                <strong>
                  {cropData.length} / 33
                </strong>

                <span>
                  Districts
                </span>

              </div>

            </AnalyticsCard>

          </div>

        </Panel>

      </div>

      {/* ==========================================
          HISTORICAL TREND — PHASE 10
      ========================================== */}

      <div className="historical-trend-panel">

        <Panel title="Historical Trend">

          <HistoricalTrend />

        </Panel>

      </div>

      {/* ==========================================
          LIVE UPDATES
      ========================================== */}

      <div className="bottom-panel">

        <Panel title="Live Crop Updates">

          <LiveTicker />

        </Panel>

      </div>

    </div>
  );
}

export default CropDashboard;