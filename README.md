# Microsoft Teams Clone
A clone of the Microsoft Teams App with **video calling** and **chat feature**, made using **Node.js**, **Express.js** for back-end and **HTML**, **CSS** and **Vanilla Javascipt** for front-end with custom UI.

### Link to the Web Application
[Click to see!](https://historic-grand-teton-33760.herokuapp.com)

### To Run on Localhost server
1) Clone the repository.
2) In project directory run: `npm install`. This will install all the dependecies in the local node_modules folder.
3) Run: `nodemon start` or `node server.js`

### Features Implemented
The homepage of the app provides two options:

1. **Video meeting option:**<br/>
  1.1 Video calling with any number of people.<br/>
  1.2 Able to mute/unmute audio and on/off camera during video call meeting.<br/>
  1.3 Able to see the participants' list in the meeting (changes dynamically as people join and leave meeting).<br/>
  1.4 Chat box window available inside video call to chat with participants of the meeting.<br/>
  1.5 Chat notification on new messages in chat window.<br/>
  1.6 Leave button to leave the meeting and go to home page.<br/>
  1.7 Share Meeting Link button to copy meeting link to clipboard- to share with others.<br/>
  
2. **Chat room option:**<br/>
  2.1 Chat room which any number of people can join.<br/>
  2.2 Able to see the participants' list in the meeting (changes dynamically as people join and leave chat room).<br/>
  2.3 Can send as many messages as you want. No limit on number of messages that can be sent or received.<br/>
  2.4 Messages displayed along with username of the participant sending the message and current time.<br/>
  2.5 Ability to start video meeting from the chat room. The meeting link is shared with everyone once someone starts a meeting by clicking on Launch Meeting button.<br/>
  2.6 Leave button to leave the room and go to home page.<br/>
  2.7 Share Chat Room Link button to copy room link to clipboard- to share with others.<br/>
  
## Implementing the ADAPT Feature in the App
The app provides the option to start a video call meeting when inside a chat room. <br/>
The chat room has 'Launch Meeting' button the sidebar which can be clicked and a new meeting opens in a new tab. The meeting link is shared in the chat.<br/>
Participants can join the video meeting, chat inside the meeting, and then leave the meeting to continue their conversation the chat room again.


  
 

