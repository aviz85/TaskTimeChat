import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

export function setupWebSocket(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("taskUpdate", (data) => {
      socket.broadcast.emit("taskUpdate", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
}
