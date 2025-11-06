import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGame, joinGame } from "../api/gamesApi";

export default function GameDetailPage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [name, setName] = useState("");
  const [players, setPlayers] = useState("");
  const [playerNumber, setPlayerNumber] = useState(0);

  const fetchGame = async () => {
    const res = await getGame(gameId);
    setGame(res.data);
  };

  useEffect(() => {
    parsePlayers();
  }, [game]);

  function parsePlayers() {
    let s = "";
    let first = true;
    let num = 0;
    if (game && game.players)
    for (var playerid in game.players){
        num++;
        if (!first) {
            s+= ", "
        }
        first = false;
        const player = game.players[playerid];
        s+= player.name;
    }
    setPlayers(s);
    setPlayerNumber(num);
  }

  const handleJoin = async () => {
    if (!name || name.length < 2) return;
    await joinGame(gameId, name);
    fetchGame();
  };

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  if (!game) return <p>Loading...</p>;

  return (
    <div>
      <h2>Game {gameId}</h2>
      <p>State: {game.state}</p>
      <p>Players {playerNumber}/4: {players}</p>

      <div style={{ marginTop: "1rem" }}>
        <input
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={handleJoin}>Join Game</button>
      </div>
    </div>
  );
}
