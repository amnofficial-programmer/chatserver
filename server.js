// Setup basic express server
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

const io = socketio(server,{
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST","HEAD","PUT","PATCH","DELETE"],
      allowedHeaders: ["my-custom-header","Authorization","Content-Type"],
      credentials: true
    }
});
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {

  socket.on('joinChatRoom', ({from, to}) => {

    var f = parseInt(from);
    var t = parseInt(to);

    //var fr = sortAlphabets(from);
    //var tooo = sortAlphabets(to);

    //var roo = sortAlphabets(fr + tooo)
    var room = "null";
     if(f < t){
       room = from+to;
     }else{
       room = to+from;
    }
    console.log('joined chat room '+ from + ' to '+ to)
    console.log('room', room)
    const user = userJoin(socket.id, from, room);
    socket.join(room);


    /*console.log(`${username} has joined ${room} room`);
    socket.emit('message1', formatMessage('Admin',username,`Welcome to chat`));
    socket.broadcast.to(user.room).emit('message1',formatMessage('user',`${user.username} has joined a chat`));*/
  });

  socket.on('message', msg => {

    console.log('Message from  '+ msg['from'] + ' to '+ msg['to'])
   // var fr = sortAlphabets(msg['from']);
    //var tooo = sortAlphabets(msg['to']);

    //var roo = sortAlphabets(fr + tooo)
    var room = "null";
     var f = parseInt(msg['from']);
     var t = parseInt(msg['to']);
     var room = null;
     if(f < t){
       room = msg['from'] + msg['to'];
     }else{
       room =  msg['to'] + msg['from'] ;
     }

    //var room = msg['from'] + msg['to'];
    io.to(room).emit('message1', msg);

    /*console.log(getRoomUsers('room1'));

    const user = getCurrentUser(socket.id);
    console.log(user);  

    if(undefined != user && undefined != user.room && null != user.room){
      io.to(user.room).emit('message1', formatMessage(user.username, msg.text));
    }*/
  
  });
  // socket.on('disconnect', ()=>{
  //   io.emit('message1',formatMessage('Admin','user has disconnected'));
  //   console.log('user disconnected');
  // });

 


});


var sortAlphabets = function(text) {
  return text.split('').sort().join('');
};


server.listen(port,"127.0.0.1", () => {
  console.log('Server listening at port %d', port);
});


