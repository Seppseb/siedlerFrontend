import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getGame, joinGame } from "../api/gamesApi";
import { useGameWebSocket } from "../hooks/useGameWebSocket";
import { Link, useNavigate } from "react-router-dom";

export default function GameDetailPage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [name, setName] = useState("");
  const [players, setPlayers] = useState("");
  const [playerNumber, setPlayerNumber] = useState(0);
  const [playerId, setPlayerId] = useState(null);
  const [isOwner, setisOwner] = useState(false);

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
    setPlayers(names.join(", "));
    setPlayerNumber(names.length);
  }

  const handleJoin = async () => {
    if (!name || name.length < 1) return;
    const res = await joinGame(gameId, name);
    console.log(res);
    if (res && res.data && res.data.userId);
    setPlayerId(res.data.userId);
  };

  const handleStartGame = async () => {
    if (isOwner) {
      navigate(`/games/${gameId}/board`);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    console.log(playerId);
    setisOwner(playerId && game && game.ownerId && playerId === game.ownerId);
  }, [playerId, game]);

  if (!game) return <p>Loading...</p>;

  return (
    <div>
      <h2>Game {gameId}</h2>
      <p>State: {game.state}</p>
      <p>
        Players {playerNumber}/4: {players}
      </p>

      <div style={{ marginTop: "1rem" }}>
      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleJoin}>Join Game</button>

      {isOwner && (
        <button
          onClick={handleStartGame}
          style={{
            marginLeft: "0.5rem",
            backgroundColor: "green",
            color: "white",
          }}
        >
          Start Game
        </button>
      )}
      {!isOwner && game && game.players && game.ownerId && game.players[game.ownerId] && game.players[game.ownerId].name && (
        <button
          style={{
            marginLeft: "0.5rem",
            backgroundColor: "green",
            color: "white",
          }}
        >
          Wait for {game.players[game.ownerId].name} to start the game
        </button>
      )}
    </div>
    </div>
  );
}
