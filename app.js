const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;
const index = require('./routes/index');
const { SSL_OP_NO_TICKET } = require('constants');

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;
let latestMessage = ''

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  socket.on('newMessage', (msg) => {
    latestMessage = msg
    socket.emit('latestMessage', latestMessage);
  })

  socket.emit('latestMessage', latestMessage)
});

server.listen(port, () => console.log(`Listening on port ${port}`));
