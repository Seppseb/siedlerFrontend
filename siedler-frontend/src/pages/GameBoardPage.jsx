import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import { useNavigate } from "react-router-dom";
import PlayerPanel from "../components/PlayerPanel";
import ShopBar from "../components/ShopBar";
import HexBoard from "../components/HexBoard";
import { getGame, sendReady } from "../api/gamesApi";
import DiceRollPopup from "../components/DiceRollPopup"; 
import { AnimatePresence } from "framer-motion";

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
  const [playerId, setPlayerId] = useState(getCookie("userId"));
  const [isOwner, setisOwner] = useState(false);
  
  
  const [showDicePopup, setShowDicePopup] = useState(false);
  const [diceValues, setDiceValues] = useState([0, 0]); // To hold the values from the server

  console.log("Game:", game);
  console.log("Player ID:", playerId);

  const navigate = useNavigate();

  function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

    const handleWebSocketMessage = useCallback((event) => {
      if (event.game) {
        setGame(event.game);
      }
      // Check if it's a 'roll dice' message for the current player
      if (event.type === 'INITIAL_ROLL' && event.playerId === playerId) {
        // Assume the dice values are in the event payload
        if (event.message) {
          const dice1 = event.message[0];
          const dice2 = event.message[1];
          console.log(event.message);
          console.log(dice1);
          console.log(dice2);
          setDiceValues([dice1, dice2]);
          setShowDicePopup(true); // <--- Function call to open the popup
        }
      }
    }, [playerId]);
  
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
    sendReady(gameId);
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
  
  // *** NEW CONFIRMATION HANDLER (You need to implement the actual server call) ***
  const handleRollConfirm = (dice1, dice2) => {
    // In a real app, you would send a message to the server here:
    console.log(`Sending roll confirmation to server: [${dice1}, ${dice2}]`);
    // Example: sendWebSocketMessage({ type: 'DICE_ROLLED', dice1, dice2, gameId });
  };
  
  const handlePopupClose = () => {
    setShowDicePopup(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-emerald-900 text-white">
      {/* ... existing layout ... */}
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
            <HexBoard 
              board ={ game && game.board ? game.board : null }
            />
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

      {/* *** NEW POPUP INTEGRATION *** */}
      <AnimatePresence>
        {showDicePopup && (
          <DiceRollPopup
            diceValues={diceValues}
            onRollConfirm={handleRollConfirm}
            onClose={handlePopupClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}