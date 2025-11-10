import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Hook to handle websocket connection per game
export function useGameWebSocket(gameId, onMessage) {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!gameId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // auto reconnect every 5s
      debug: (str) => console.log("STOMP:", str),
      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        client.subscribe(`/topic/games/${gameId}`, (message) => {
          const event = JSON.parse(message.body);
          console.log("📩 Received event:", event);
          if (onMessage) onMessage(event);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("🔌 Disconnecting WebSocket");
      client.deactivate();
    };
  }, [gameId, onMessage]);

  return clientRef.current;
}
