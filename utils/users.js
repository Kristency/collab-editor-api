const users = [];

// addUser, removeUser, getUser, getUsersInRoom

// here id of the user is the socket.id which is unique for every user

const addUser = ({ id, username, editorId }) => {
  //clean the data
  username = username.trim().toLowerCase();
  editorId = editorId.trim();

  // validate the data
  if (!username || !editorId) {
    return { error: 'username and room id are required!' };
  }

  // check for existing user
  const existingUser = users.find(
    (user) => user.editorId === editorId && user.username === username
  );

  if (existingUser) {
    return { error: 'username is in use' };
  }

  // store user
  const user = { id, username, editorId };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (editorId) => {
  editorId = editorId.trim();

  return users.filter((user) => user.editorId === editorId);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
