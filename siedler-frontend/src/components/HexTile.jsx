import clay from "../assets/clay.png";
import desert from "../assets/desert.png";
import stone from "../assets/stone.png";
import wheat from "../assets/wheat.png";
import wood from "../assets/wood.png";
import wool from "../assets/wool.png";

export default function HexTile({ type, number }) {
  const colors = {"wood": "#A8D5BA", "desert": "#F7E97E", "water": "#A9CBE8", "clay": "#D7A59A", "wheat": "#DDE48A", "stone": "#D3D4D9", "wool": "#E8F5E4"};
  const images = {"wood": wood, "desert": desert, "clay": clay, "wheat": wheat, "stone": stone, "wool": wool};

  //#A8D5BA  (mint green)
  //#F7E97E  (soft bright yellow)
  //#A9CBE8  (pastel blue)
  //#D7A59A  (soft terracotta/red-brown)
  //#DDE48A  (pear yellow-green)
  //#D3D4D9  (light silver grey)
  //#E8F5E4  (white-green seafoam)

  return (
    <div 
      className={`bg-yellow-500 clip-hexagon border border-emerald-900 flex items-center justify-center text-8xl font-bold text-emerald-950`}
      style={{
        backgroundColor: colors[type],
        width: "6rem",
        height: "6rem",
        position: "relative",
        display: "inline-block",
        margin: "-0.2rem",
        color: "black",
        fontSize: "2rem",
      }}
    >
      {number == "0" ? "" : number}
      <img 
        src={images[type]}
        alt=""
        style={{
          position: "absolute",
          left: "50%",
          top: "1rem",
          transform: "translateX(-50%)",
          width: "3rem",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
