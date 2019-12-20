const port = 3005;
const app = require('express')();
const http = require('http').createServer(app);
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const obstacle = require('./obstacle');

let players = [];
let obstaclesInterval;

io.on('connection', socket => {
    console.log('a user connected with id ', socket.id);

    socket.on('obstacles', (obsticaleRival) => {
        io.to(players.filter((playerID) => playerID !== socket.id))
            .emit('rival send obstacle', obsticaleRival);
    })

    if (players.length < 2) {
        players.push(socket.id);

        if (players.length == 1) {
            console.log('waiting to second player...');
        } else if (players.length == 2) {
            socket.emit('start game', { players: players });

            /*obstaclesInterval = setInterval(() => {
                io.to(players[0]).emit('obstacle', { obstacle: obstacle.CROW });
                io.to(players[1]).emit('obstacle', { obstacle: obstacle.ROCK });
                io.sockets.emit('obstacle', { obstacle: obstacle.ROCK });
            }, 3000);*/

        } else {
            console.log('something wrong...');
        }
    }

    socket.on('game start', data => {
        console.log(data.room);
        socket.broadcast
            .to(data.room)
            .emit('receive message', data)
    });

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

    socket.on('change background to rival', () => {
        io.to(players.filter((playerID) => playerID !== socket.id))
            .emit('background changed to rival');
    })
});

server.listen(port);