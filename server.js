const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req,res) => {

    res.redirect(`/${uuidv4()}`);
})

app.get('/:meeting', (req,res) => {

    res.render('meeting.ejs', { meetingID : req.params.meeting })
})

io.on('connection', socket => {
    socket.on('joinMeeting', (meetingID, userID) => {
        socket.join(meetingID);
        socket.broadcast.to(meetingID).emit('userConnected', userID);
        
        socket.on('message', message => {
            io.to(meetingID).emit('createMsg', message);
        })

        socket.on('disconnect', () => {
            socket.broadcast.to(meetingID).emit('userDisconnected', userID);
        })
        
    })
})

server.listen(3000);