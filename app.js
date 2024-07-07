const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const server = http.createServer(app);//
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
io.on('connection',(socket)=>{
    socket.on("send-location", (data)=>{//getting data from frontend
        io.emit('receive-location',{id:socket.id, ...data})//sending data to frontend
    })

    socket.on("disconnect", ()=>{
        io.emit("user-disconnected", socket.id)
    })
    console.log('connected');
})
app.get('/', (req, res) => {
    res.render('index');
  });
server.listen(3000);