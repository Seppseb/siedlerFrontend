import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import { useNavigate } from "react-router-dom";
import PlayerPanel from "../components/PlayerPanel";
import ShopBar from "../components/ShopBar";
import HexBoard from "../components/HexBoard";
import { getGame } from "../api/gamesApi";

export default function GameBoardPage() {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [name, setName] = useState("");
  const [players, setPlayers] = useState("");
  const [playerNumber, setPlayerNumber] = useState(0);
  const [playerId, setPlayerId] = useState(null);
  const [isOwner, setisOwner] = useState(false);

  console.log("Game:", game);
  console.log("Player ID:", playerId);

  const navigate = useNavigate();

  // TODO get playerid from cookie
  // update playerid stuff
    const handleWebSocketMessage = useCallback((event) => {
      if (event.game) {
        setGame(event.game);
      }
    }, []);
  
    useGameWebSocket(gameId, handleWebSocketMessage);
  
    const fetchGame = async () => {
      const res = await getGame(gameId);
      setGame(res.data);
    };
  
    useEffect(() => {
      if (game) parsePlayers();
    }, [game]);
  
    function parsePlayers() {
      if (!game || !game.players) return;
      const names = Object.values(game.players).map((p) => p.name);
      setPlayerNumber(names.length);
    }
  
    useEffect(() => {
      fetchGame();
    }, [gameId]);
  
    useEffect(() => {
      console.log(playerId);
      setisOwner(playerId && game && game.ownerId && playerId === game.ownerId);
    }, [playerId, game]);

  // center on load
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.4), 3));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startDrag.x,
      y: e.clientY - startDrag.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-emerald-900 text-white">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 bg-emerald-800 border-r border-emerald-700 flex flex-col justify-center p-4">
          <PlayerPanel side="left" />
        </div>
        <div
          className="flex-1 bg-slate-900 relative overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute transition-transform duration-150 ease-in-out"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) translate(-50%, -50%)`,
              transformOrigin: "center",
              willChange: "transform",
            }}
          >
            <HexBoard />
          </div>

          <div className="pointer-events-none absolute inset-0 border-4 border-emerald-950"></div>
        </div>
        <div className="w-1/5 bg-emerald-800 border-l border-emerald-700 flex flex-col justify-center p-4">
          <PlayerPanel side="right" />
        </div>
      </div>
      <div className="h-32 bg-emerald-950 border-t border-emerald-800">
        <ShopBar />
      </div>
    </div>
  );
}
