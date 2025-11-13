import HexTile from "./HexTile";

export default function HexBoard() {
  // Define the shape: number of hexes in each row
  const rowConfig = [3, 4, 5, 4, 3];
  const colors = ["bg-yellow-500", "bg-green-500", "bg-red-500", "bg-blue-500", "bg-orange-500"];

  return (
    <div className="relative">
    <div className="hidden bg-yellow-500 bg-green-500 bg-red-500 bg-blue-500 bg-orange-500"></div>
      {rowConfig.map((cols, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center"
          style={{
            marginTop: rowIndex === 0 ? 0 : "-12px", // overlap rows vertically
            marginLeft: `${(5 - cols) * 1}px`, // offset to center hex shape
          }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <HexTile
              key={`${rowIndex}-${colIndex}`}
              color={colors[Math.floor(Math.random() * colors.length)]}
              label={`${rowIndex},${colIndex}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
