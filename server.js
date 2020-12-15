// Setup basic express server

const path = require('path');
const http = require('http');
const express = require('express');
var cors = require('cors')
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const {
  connect,
  disconnect,
  query,
  insert,
  getHistoryChats,
  updateChatMessageStatus
} = require('./utils/db');

const {
  getRoomId
} = require('./utils/generic');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({});
  }
  next();
})

var corsOptions = {
  origin: "http://localhost:4200",
  methods: ["GET", "POST","HEAD","PUT","PATCH","DELETE"],
  allowedHeaders: ["my-custom-header","Authorization","Content-Type"],
  credentials: true
}

app.post('/chatserver/getHistoricalChats',cors(corsOptions), jsonParser,function(req, res){
  try{
    console.log("/chatserver/getHistoricalChats: ", req.body);
    let body = req.body
    //let chats = getHistoryChats(body['from'], body['to']);
    getHistoryChats(body['from_id'], body['to_id'], function(err, rows){
      if(!err){
          let response = {
            status : '200',
            data   : rows,
            message: 'SUCCESS',
            code   : '0',
            SUCC   : 'true'
          }
          res.status(200).json(response);
      }else{
          console.log(err);
          let response = {
            status : '500',
            data   : rows,
            message: err,
            code   : '0',
            SUCC   : 'false'
          }
          res.status(500).send(response);
      }
    });
  
  }catch(err){
    console.log(err);
    res.status(500).send('');
  }
})

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

    socket.on('joinChatRoom', ({from_id, to_id}) => {

      var f = parseInt(from_id);
      var t = parseInt(to_id);
      var room = "null";
      if(f < t){
        room = from_id+to_id;
      }else{
        room = to_id+from_id;
      }
      console.log('joined chat room '+ from_id + ' to '+ to_id)
      console.log('room', room)
      const user = userJoin(socket.id, from_id, room);
      socket.join(room);

     // let history_chats = getHistoryChats(from_id, to_id);
     // console.log(history_chats);

      /*console.log(`${username} has joined ${room} room`);
      socket.emit('message1', formatMessage('Admin',username,`Welcome to chat`));
      socket.broadcast.to(user.room).emit('message1',formatMessage('user',`${user.username} has joined a chat`));*/
    });

    socket.on('getHistoricalChats', ({from, to}) => {

      var f = parseInt(from);
      var t = parseInt(to);
      let history_chats = getHistoryChats(from, to);
      console.log(history_chats);

    });

    socket.on('statusUpdate', message => {
      updateChatMessageStatus(message['message_id'], message['from_id'], message['to_id'],message['status']);
      let roomId =  getRoomId(message['from_id'], message['to_id']);
      io.to(roomId).emit('statusUpdated',message);
    })

    socket.on('message', msg => {
      console.log('Message from  '+ msg['from_id'] + ' to '+ msg['to_id'])
      let roomId = getRoomId(msg['from_id'], msg['to_id']);
      io.to(roomId).emit('message1', msg);
      insert(msg['message_id'],msg['from_id'],msg['to_id'],msg['time'],msg['text'],msg['status']);
    
    });


  // socket.on('disconnect', ()=>{
  //   io.emit('message1',formatMessage('Admin','user has disconnected'));
  //   console.log('user disconnected');
  // });

 


});




var sortAlphabets = function(text) {
  return text.split('').sort().join('');
};


// server.listen(port,"127.0.0.1", () => {
//   console.log('Server listening at port %d', port);
// });

server.listen(port,() => {
  console.log('Server listening at port %d', port);
});


