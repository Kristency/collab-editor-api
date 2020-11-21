const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./utils/users');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`serving on port ${PORT}`);
});

const io = socketio(server);

io.on('connection', (socket) => {
  console.log(`new socket connection with id ${socket.id}`);

  socket.on('editor-state', (data) => {
    const user = getUser(socket.id);
    socket.broadcast.in(user.editorId).emit('editor-state', data);
  });

  socket.on('join-editor', ({ username, editorId }) => {
    const { error, user } = addUser({ id: socket.id, username, editorId });

    socket.join(user.editorId, () => {
      console.log(
        `${user.username} joined editor with id ${user.editorId} successfully`
      );
    });

    socket.broadcast
      .to(user.editorId)
      .emit('message', `${user.username} has joined!`);

    io.to(user.editorId).emit('user-list', getUsersInRoom(user.editorId));
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.editorId).emit('message', `${user.username} has left!`);
      io.to(user.editorId).emit('user-list', getUsersInRoom(user.editorId));
    }
  });
});
