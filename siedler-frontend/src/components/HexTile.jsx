export default function HexTile({ color, label }) {
  return (
    <div
      className={`${color} clip-hexagon border border-emerald-900 flex items-center justify-center text-4xl font-bold text-emerald-950`}
      style={{
        width: "6rem",
        height: "6rem",
        display: "inline-block",
        margin: "-0.2rem",
      }}
    >
      {label}
    </div>
  );
}
