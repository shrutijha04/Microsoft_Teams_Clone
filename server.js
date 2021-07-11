const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

const formatMessage = require('./utils/messages');

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const {
    userJoinVideo,
    getCurrentUserVideo,
    userLeaveVideo,
    getRoomUsersVideo
  } = require('./utils/usersVideo.js');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use('/peerjs', peerServer);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const botName = 'Microsoft Teams Chat';

app.get('/', (req,res) => {
    res.render('index.ejs');
})

let usernameVideo;
app.get('/video-call', (req,res) => {
    usernameVideo="User";
    res.render('videoform.ejs');
   // res.redirect(`/video-call/${uuidv4()}`);
})

app.post('/video-call', (req,res) => {
    usernameVideo = req.body.username;
    const videoroom = req.body.room;
    res.redirect(`/video-call/${videoroom}`);
})

let username;
app.get('/chat', (req,res) => {
    username="User";
    res.render('chatform.ejs');
})

app.post('/chat', (req,res) => {
    username = req.body.username;
    const chatroom = req.body.room;
    res.redirect(`/chat/${chatroom}`);
})

app.get('/chat/:chatid', (req,res) => {
    //console.log(req.params.chatid);
    res.render('chatroom.ejs', { chatID : req.params.chatid, username: username});

})

app.get('/video-call/:meeting', (req,res) => {

  res.render('meeting.ejs', { meetingID : req.params.meeting, usernameVideo: usernameVideo })
})

app.get('/video-call-in-chat', (req,res) => {

    res.redirect(`/video-call-in-chat/${uuidv4()}`);
})

app.get('/video-call-in-chat/:meeting', (req,res) => {

  res.render('meeting.ejs', { meetingID : req.params.meeting, usernameVideo: username })
})


io.on('connection', socket => {
    socket.on('joinMeeting', ({ usernameVideo, meeting_ID , id}) => {
      const user = userJoinVideo(socket.id, id, usernameVideo, meeting_ID);
       // console.log("socket.id on joining"+ socket.id);
      socket.join(user.room);

      socket.broadcast.to(user.room).emit('userConnected', user.peerid);
      // Send users and room info
      io.to(user.room).emit('meetingUsers', {
        room: user.room,
        users: getRoomUsersVideo(user.room)
      });
    });
  
    // Listen for chatMessage
    socket.on('message', msg => {
      const user = getCurrentUserVideo(socket.id);
      io.to(user.room).emit('createMsg', {username : user.username, message: msg});
    });
  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeaveVideo(socket.id);
      if (user) {
        // Send users and room info
        socket.broadcast.to(user.room).emit('userDisconnected', user.peerid);
        io.to(user.room).emit('meetingUsers', {
          room: user.room,
          users: getRoomUsersVideo(user.room)
        });
      }
    });
});



io.on('connection', socket => {
    socket.on('joinRoom', ({ username, chatroom_ID }) => {
      const user = userJoin(socket.id, username, chatroom_ID);
   // console.log("user " + user);
      socket.join(user.room);
  
      // Welcome current user
      socket.emit('Chatmessage', formatMessage(botName, 'Welcome to Microsoft Teams Chat!'));
  
      // Broadcast when a user connects
      socket.to(user.room)
        .emit(
          'Chatmessage',
          formatMessage(botName, `${user.username} has joined the chat`)
        );
  
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit('Chatmessage', formatMessage(user.username, msg));
    });

  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          'Chatmessage',
          formatMessage(botName, `${user.username} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });

});


const PORT = process.env.PORT || 3000;
server.listen(PORT);