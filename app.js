const port = 3005;
const app = require('express')();
const http = require('http').createServer(app);
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const obstacle = require('./obstacle');

let players = [];

io.on('connection', socket => {
    console.log('a user connected');
    console.log('socket id', socket.id);

    players.push(socket.id);

    if (players.length == 1) {
        console.log('waiting to second player...');
    } else if (players.length == 2) {
        console.log('lets play');
        socket.emit('start game', { players: players });
        setInterval(() => {
            socket.emit('obstacle', { obstacle: obstacle.ROCK });
            console.log('obstacle: ' + obstacle.ROCK);
            
        }, 3000)
    } else {
        console.log('something wrong...');
    }

    socket.on('disconnect', reason => {
        console.log('user disconnected', socket.id);
        let index = players.indexOf(socket.id);
        if (index > -1) {
            players.splice(index, 1);
        }
        console.log('there is ' + players.length + 1 + 'players now.');
    });

    socket.on('game start', data => {
        console.log(data.room);
        socket.broadcast
            .to(data.room)
            .emit('receive message', data)
    });
});

server.listen(port);