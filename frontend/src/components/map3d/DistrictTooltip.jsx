function DistrictTooltip({ district, value, x, y }) {

  if (!district) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: x + 15,
        top: y + 15,
        pointerEvents: "none",
        background: "#111827",
        color: "#fff",
        border: "1px solid cyan",
        borderRadius: "8px",
        padding: "10px",
        fontSize: "14px",
        zIndex: 9999,
      }}
    >
      <strong>{district}</strong>

      <br />

      Acreage : {value} ha
    </div>
  );
}

export default DistrictTooltip;