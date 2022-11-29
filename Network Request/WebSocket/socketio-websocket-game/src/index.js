const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3000;

/* MIDDLEWARE ADD PUBLIC FOLDER */
app.use(express.static("public"));
 
const users = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (username) => {
   users[socket.id] = {
    username,
   };
   console.log(users);
  })
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});