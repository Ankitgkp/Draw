"use client";

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {


  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjYzIzYzNkOS0xY2I1LTRhMTQtOWVmNy1mOWY3OWZkMDY2ODgiLCJpYXQiOjE3NjE0MTcwNjZ9.WyiLvJFUtvRSOXTXp5ixbWrtb9T7cfd9tiPCnDN-kok`);

    ws.onopen = () => {
      console.log('WebSocket connected, joining room:', roomId);
      setSocket(ws);
      ws.send(JSON.stringify({
        type: 'join_room',
        roomId
      }))
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      console.log('Cleaning up WebSocket connection');
      ws.close();
    };
  }, [roomId]);

  if (!socket) {
    return <div>Connecting to server...</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
      {/* <div className="absoulut bottom-0 right-0">
        <button className="bg-white text-black">Rectangle</button>
        <button className="bg-white text-black">Circle</button>
      </div> */}
    </div>
  );
}
