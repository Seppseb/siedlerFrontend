import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/games",
  withCredentials: true,
});

export const listGames = () => API.get("");
export const createGame = () => API.post("/create");
export const joinGame = (gameId, name) => API.post(`/${gameId}/join?name=${name}`);
export const getGame = (gameId) => API.get(`/${gameId}`);
