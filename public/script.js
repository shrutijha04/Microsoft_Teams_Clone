const socket = io();

const videoGrid = document.getElementById('videoGrid');
const userList = document.getElementById('users');

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
        
        //console.log("User connected" + userID);
    });

    socket.on('meetingUsers', ({ room, users }) => {
        outputUsers(users);
      });

    socket.on('userDisconnected', userID => {
        if(peers[userID]) peers[userID].close();
    });

    let text = $('input');
    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0){
          let msg = text.val();
          text.val('');
        socket.emit('message', msg);
        //text.val('');
        }
    });

    socket.on('createMsg', ({username, message}) => {
        changeiconToPing();
        $('.messages').append(`<li class="message"><b>${username}</b><br/>${message}</li>`);
        scrollToBottom();
        //console.log(peers);
    })

})

peer.on('open', id => {
    //console.log(usernameVideo +" "+meeting_ID+" "+id);
    socket.emit('joinMeeting', ({usernameVideo, meeting_ID, id}));
})

function connectToNewUser(userID, stream){
    //console.log("connecting to new user");
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
   // console.log("appended");
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

const changeiconToPing = () =>{
  const html = `
  <i class='bx bx-message-rounded-add'></i>
  <span>Chat</span>
  `
  document.querySelector('.chat-icon').innerHTML = html;
}

const changeiconToNormal = () =>{
  const html = `
  <i class='bx bx-message-rounded'></i>
  <span>Chat</span>
  `
  document.querySelector('.chat-icon').innerHTML = html;
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

const openChatWin = () => {

    var sidebar = document.getElementById("sidebar");
    var mainWin = document.getElementById("mainWin");

    if (sidebar.style.width == "270px" && mainWin.style.marginRight == "270px") {
        sidebar.style.width = "0";
        mainWin.style.marginRight = "0";
    } else {
        sidebar.style.width = "270px";
        mainWin.style.marginRight = "270px"
        changeiconToNormal();
    }
}

const closeChatWin = () => {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("mainWin").style.marginRight= "0";
}
  
const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };
  
document.getElementById('copy-btn').addEventListener('click', () => {
  
      copyToClipboard(meeting_ID);
      alert("Meeting link copied!");
  });

document.getElementById('show-users-btn').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "flex";
});

document.querySelector('.close-btn').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "none";
});

function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }








