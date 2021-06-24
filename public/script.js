const socket = io('/');

const videoGrid = document.getElementById('videoGrid');

const peer = new Peer(undefined);

const myVideo = document.createElement('video');
myVideo.muted = true;
let myVideoStream;
const peers = {}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video1 = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video1, userVideoStream);
        })
    })

    socket.on('userConnected', userID => {
        connectToNewUser(userID, stream);
        console.log("User connected" + userID);
    });

    socket.on('userDisconnected', userID => {
        if(peers[userID]) peers[userID].close();
    });

    let text = $('input');
    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0){
        socket.emit('message', text.val());
        text.val('');
        }
    });

    socket.on('createMsg', message => {
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom();
    })

})

peer.on('open', id => {
    socket.emit('joinMeeting', meeting_ID, id);
})

function connectToNewUser(userID, stream){
    const call = peer.call(userID, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
    call.on('close', () => {
        video.remove();
    })

    peers[userID] = call;
}

function addVideoStream(video , stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

const scrollToBottom = () => {
    var d = $('.main_chatWindow');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}
  
const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
  }
  
const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}
  








