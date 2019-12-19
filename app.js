const port = 3005;
const app = require('express')();
const cors = require('cors');
const config = require('config');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const obstacle = require('./obstacle');

const starterRouter = require('./src/starter.routes');



io.on('connection', function (socket) {
    console.log('a user connected', socket.id);

    socket.on('room', function (data) {
        console.log(data);
        // socket.emit('acknowledge', 'Acknowledged');
    });
    socket.on('joined', function (data) {
        console.log(data);
        socket.emit('acknowledge', 'Acknowledged');
    });
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        socket.emit('response message', msg + '  from server');
    });
    setInterval(() => {
        socket.emit('obstacle', { obstacle: obstacle.obstacle });
    }, 3000)
});

app.use(cors({
    origin: config.clientUrl,
    optionsSuccessStatus: 200,
    credentials: true
}));

app.options('*', cors({
    origin: config.clientUrl,
    optionsSuccessStatus: 200,
    credentials: true
}));

app.use((err, req, res, next) => {
    const status = err.status ? err.status : 500;
    res.status(status);
    res.send({ error: err });
});

app.use('/starter', starterRouter);

app.listen(port, () => {
    console.log(`api is listening on ${port}`);
});