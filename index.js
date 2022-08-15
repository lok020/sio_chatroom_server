const express = require("express");
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconneted: ${socket.id}`);
  })

  socket.on("join_room", (payload) => {
    socket.join(payload.room);
    socket.to(payload.room).emit("joined_room", payload);
    console.log(`User ${socket.id} with username ${payload.username} joined ${payload.room}`);
  })

  socket.on("leave_room", (payload) => {
    socket.leave(payload.room);
    socket.to(payload.room).emit("left_room", payload);
    console.log(`User ${socket.id} with username ${payload.username} leaved ${payload.room}`);
  })

  socket.on("send_message", (payload) => {
    // socket.broadcast.emit("receive_message", payload);
    socket.to(payload.room).emit("receive_message", payload);
    console.log(`User ${socket.id} with username ${JSON.stringify(payload.username)} sent message ${JSON.stringify(payload.message)} to ${JSON.stringify(payload.room)} at ${JSON.stringify(payload.date_time)}`);
  })
});

server.listen(3001, () => {
  console.log("Server is running on 3001");
})