const port = 3005;
const app = require('express')();
const http = require('http').createServer(app);
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const obstacle = require('./obstacle');

let players = [];
let obstaclesInterval;

io.on('connection', socket => {
    console.log('a user connected');
    console.log('socket id', socket.id);
    socket.join('some room' + socket.id);
    console.log('some room' + socket.id);
    

    players.push(socket.id);

    if (players.length == 1) {
        console.log('waiting to second player...');
    } else if (players.length == 2) {
        socket.emit('start game', { players: players });
        console.log(players[0]);
        console.log(players[1]);

        obstaclesInterval = setInterval(() => {
            socket.to('some room' + players[0]).emit('obstacle', { obstacle: obstacle.CROW });
            socket.emit('obstacle', { obstacle: obstacle.ROCK });
        }, 3000);

    } else {
        console.log('something wrong...');
    }

    socket.on('disconnect', reason => {
        console.log('user disconnected', socket.id);

        clearInterval(obstaclesInterval);
        // delete the disconnect player from players array
        let index = players.indexOf(socket.id);
        if (index > -1) {
            players.splice(index, 1);
        }
        console.log('there is ' + (players.length + 1) + ' players now.');
    });

    socket.on('game start', data => {
        console.log(data.room);
        socket.broadcast
            .to(data.room)
            .emit('receive message', data)
    });
});

server.listen(port);