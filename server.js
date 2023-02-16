const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const {v4: uuidv4} = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const hostname = "0.0.0.0";

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);
app.get('/',(req,res) =>{
    res.redirect(`/${uuidv4()}`);
})
const rom = ""
app.get('/:room',(req,res) => {
    res.render('room',{roomId: req.params.room});
})
// app.get('/:user',(req,res) => {
//     res.render('user',{userId: req.params.user});
// })

io.on('connection',socket =>{
    socket.on('join-room', (roomId,userId) => {
        socket.join(roomId);
        console.log("User id ",userId);
        console.log("room id ",roomId);
        socket.broadcast.to(roomId).emit('user-connected',userId);
        // socket.broadcast.to(userId).emit('user-connected',userId);
        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message,userId)
        })    
    })
})

server.listen(process.env.PORT||3030);