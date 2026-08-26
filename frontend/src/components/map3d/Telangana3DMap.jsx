import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import DistrictTooltip from "./DistrictTooltip";

function TelanganaShape({ setTooltip, selectedCrop }) {
  console.log("Current Selected Crop:", selectedCrop);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={(e) => {
        setTooltip({
          district: "Nalgonda",
          value: 12540,
          x: e.clientX,
          y: e.clientY,
        });
      }}
      onPointerOut={() => {
        setTooltip({
          district: "",
          value: "",
          x: 0,
          y: 0,
        });
      }}
    >
      <extrudeGeometry
        args={[
          new THREE.Shape([
            new THREE.Vector2(-1, -1),
            new THREE.Vector2(1, -1),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(-1, 1),
          ]),
          {
            depth: 0.2,
            bevelEnabled: false,
          },
        ]}
      />

      <meshStandardMaterial
        color="#00ffff"
        metalness={0.4}
        roughness={0.3}
      />
    </mesh>
  );
}

function Telangana3DMap({ selectedCrop }) {
  const [geoData, setGeoData] = useState(null);

  const [tooltip, setTooltip] = useState({
    district: "",
    value: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    fetch("/telangana_districts.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        console.log("GeoJSON Loaded:", data.features.length, "districts");
      })
      .catch((err) => {
        console.error("GeoJSON Error:", err);
      });
  }, []);

  return (
    <>
      <Canvas
        camera={{
          position: [0, 2, 4],
          fov: 50,
        }}
      >
        <ambientLight intensity={1} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
        />

        {/* Placeholder shape - will be replaced in the next step */}
        <TelanganaShape
  setTooltip={setTooltip}
  selectedCrop={selectedCrop}
/>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>

      <DistrictTooltip
        district={tooltip.district}
        value={tooltip.value}
        x={tooltip.x}
        y={tooltip.y}
      />
    </>
  );
}

export default Telangana3DMap;