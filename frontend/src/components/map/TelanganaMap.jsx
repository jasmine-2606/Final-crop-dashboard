import { useEffect, useMemo, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { getDistrictColor } from "../../utils/mapColors";
import MapLegend from "./MapLegend";

function ResizeMap({ geoData }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();

      if (geoData) {
        const layer = L.geoJSON(geoData);

        map.fitBounds(layer.getBounds(), {
          padding: [5, 5],
          maxZoom: 8,
        });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [map, geoData]);

  return null;
}

export default function TelanganaMap({
  selectedCrop = "Rice",
  cropData = [],
}) {
  const [geoData, setGeoData] = useState(null);
  const [geoLoading, setGeoLoading] = useState(true);
  const [geoError, setGeoError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const geoJsonRef = useRef();

  // LOAD GEOJSON
  useEffect(() => {
    loadGeoJSON();
  }, []);

  const loadGeoJSON = async () => {
    try {
      setGeoLoading(true);

      const response = await fetch("/telangana_districts.geojson");

      if (!response.ok) {
        throw new Error("GeoJSON file could not be loaded");
      }

      const data = await response.json();

      console.log("GeoJSON Loaded:", data);
      console.log("Features:", data.features?.length);

      setGeoData(data);
      setGeoError(null);
    } catch (error) {
      console.error(error);
      setGeoError("Failed to load Telangana map");
    } finally {
      setGeoLoading(false);
    }
  };

  // CROP LOOKUP
  const cropLookup = useMemo(() => {
    const lookup = {};

    cropData.forEach((item) => {
      if (item.district) {
        lookup[item.district.toUpperCase().trim()] = item;
      }
    });

    return lookup;
  }, [cropData]);

  // DATASET A ONLY — Telangana map protection
const datasetACrops = [
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

const isDatasetACrop = datasetACrops.includes(selectedCrop);

  // DISTRICT NAME NORMALIZATION
  const normalizeDistrictName = (name) => {
    const map = {
      "BHADRADRI KOTHAGUDEM": "BHADRADRI",
      JANGOAN: "JANGAON",
      "JAYASHANKAR BHUPALPALLY": "JAYASHANKAR",
      "JOGULAMBA GADWAL": "JOGULAMBA",
      "KUMURAMBHEEM ASIFABAD": "KOMARAM BHEEM",
      "MEDCHAL_MALKAJGIRI": "MEDCHAL",
      "RAJANNA SIRCILLA": "RAJANNA",
      "YADADRI BHUVANAGIRI": "YADADRI",
      HANUMAKONDA: "WARANGAL (U)",
      MULUGU: "WARANGAL (R)",
      NARAYANPET: "MAHABUBNAGAR",
      WARANGAL: "WARANGAL (R)",
    };

    return map[name] || name;
  };

  // GET DISTRICT NAME
  const getDistrictName = (feature) =>
    (feature.properties?.DISTRICT_N || "").toUpperCase().trim();

  // LOADING
  if (geoLoading) {
    return (
      <div
        style={{
          color: "#00e5ff",
          textAlign: "center",
          padding: "20px",
        }}
      >
        Loading Telangana Map...
      </div>
    );
  }

  // ERROR
  if (geoError) {
    return (
      <div
        style={{
          color: "red",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {geoError}
      </div>
    );
  }

  return (
    <div className="telangana-map-container">

      {/* SELECTED DISTRICT LABEL */}

      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "50%",
          transform: "translateX(-50%)",

          zIndex: 1000,

          padding: "6px 14px",

          color: "#00e5ff",
          textAlign: "center",
          fontWeight: "700",
          fontSize: "16px",

          whiteSpace: "nowrap",

          background: "rgba(5, 15, 30, 0.82)",
          border: "1px solid rgba(0, 229, 255, 0.35)",
          borderRadius: "8px",

          textShadow: "0 0 10px rgba(0,229,255,0.7)",

          boxShadow: "0 0 15px rgba(0,229,255,0.12)",

          pointerEvents: "none",

          minHeight: "22px",
        }}
      >
        Selected District{" "}
        <span style={{ color: "#ffffff" }}>
          {selectedDistrict || "None"}
        </span>
      </div>

      {/* LEAFLET MAP */}

      <MapContainer
        center={[17.95, 79.25]}
        zoom={8}
        minZoom={7}
        maxZoom={10}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "400px",
          borderRadius: "14px",
          background: "#081018",
        }}
      >

        {/* MAP TILES */}

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* RESIZE / FIT MAP */}

        <ResizeMap geoData={geoData} />

        {/* TELANGANA DISTRICTS */}

        <GeoJSON
          ref={geoJsonRef}
          data={geoData}
          key={selectedCrop}
          style={(feature) => {
            const district = getDistrictName(feature);
            const mapped = normalizeDistrictName(district);

            const cropKey = selectedCrop
              .toLowerCase()
              .replace(/\s+/g, "_");

            const value = isDatasetACrop
  ? Number(cropLookup[mapped]?.[cropKey] ?? 0)
  : 0;

            return {
              color:
                selectedDistrict === district
                  ? "#ffffff"
                  : "#00e5ff",

              weight:
                selectedDistrict === district
                  ? 4
                  : 2,

              fillColor: getDistrictColor(value),
              fillOpacity: 0.85,
            };
          }}

          onEachFeature={(feature, layer) => {
            const district = getDistrictName(feature);
            const mapped = normalizeDistrictName(district);

            const cropKey = selectedCrop
              .toLowerCase()
              .replace(/\s+/g, "_");

            const value = isDatasetACrop
  ? Number(cropLookup[mapped]?.[cropKey] ?? 0)
  : 0;

            layer.on({

              // CLICK

              click() {
                console.log(
                  "Selected District:",
                  district
                );

                setSelectedDistrict(district);

                layer.bindPopup(
                  `<div style="text-align:center; min-width:150px;">
                    <b>${district}</b>
                    <br />
                    ${selectedCrop}
                    <br />
                    <strong>${value.toLocaleString()} Acres</strong>
                  </div>`
                );

                layer.openPopup();
              },

              // MOUSE OVER

              mouseover(e) {
                e.target.setStyle({
                  weight: 4,
                  color: "#ffffff",
                  fillOpacity: 1,
                  opacity: 1,
                });

                layer.bindTooltip(
                  `<b>${district}</b>
                   <br/>
                   ${selectedCrop}: ${value.toLocaleString()} Acres`,
                  {
                    sticky: true,
                  }
                );

                layer.openTooltip();

                if (layer.bringToFront) {
                  layer.bringToFront();
                }
              },

              // MOUSE OUT

              mouseout(e) {
                layer.closeTooltip();

                e.target.setStyle({
                  weight:
                    selectedDistrict === district
                      ? 4
                      : 2,

                  color:
                    selectedDistrict === district
                      ? "#ffffff"
                      : "#00e5ff",

                  fillOpacity: 0.85,
                  opacity: 1,
                });
              },
            });
          }}
        />

      </MapContainer>

      {/* MAP LEGEND */}

      <MapLegend selectedCrop={selectedCrop} />

    </div>
  );
}