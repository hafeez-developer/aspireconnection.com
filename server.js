// const { Socket } = require('engine.io');
const http= require('http');
const express = require('express');
// const { use } = require('express/lib/application');
const app = express();
// const http = require('http').createServer(app)

require('./prod')(app);
    

const server=http.createServer(app);
// const hostname= '0.0.0.0';
const port = process.env.PORT || 4000


app.use(express.static('\public'));

app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

const io = require('socket.io')(server);

let users ={}

io.on('connection',(socket)=>{
    socket.on('new-user-joined',(username)=>{
        users[socket.id]=username;
        console.log(username, 'joined the chat ',socket.id);
        socket.broadcast.emit('user-connected',username)
        io.emit("user-list",users);
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-disconnected',user=users[socket.id]);
        delete users[socket.id];
        console.log(user,' left the chat ',socket.id);
        io.emit("user-list",users);
    });

    socket.on('message',(data)=>{
        socket.broadcast.emit('message',{user: data.user,msg: data.msg})
    })

    console.log('User Connected...')
    // socket.on('message', (msg)=>{
    //     socket.broadcast.emit('message',msg)
    // })
})


server.listen( port, ()=>{
    console.log(`Server Running at http://aspireConnection:${port}/`)
})