const users = [];

// Join user to chat
function userJoinVideo(id, peerid, username, room) {
  const user = { id, peerid, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUserVideo(id) {
  return users.find(user => user.id === id);
}


// User leaves chat
function userLeaveVideo(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsersVideo(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoinVideo,
  getCurrentUserVideo,
  userLeaveVideo,
  getRoomUsersVideo
};