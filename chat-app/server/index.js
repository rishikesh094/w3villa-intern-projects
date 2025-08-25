import express from "express";
import {Server} from "socket.io"
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    const payload = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      text: String(msg ?? ""),
      senderId: socket.id,
      ts: Date.now()
    };
    console.log("Message from user:", payload);

    io.emit("receiveMessage", payload);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
