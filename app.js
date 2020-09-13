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
const messages = []

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('sendMessage', (msg) => {
    messages.push(msg);
    socket.emit('newMessage', msg);
  })

  socket.emit('messageHistory', messages)
});

server.listen(port, () => console.log(`Listening on port ${port}`));
