const port = 8080;
const app = require('express')();
const cors = require('cors');
const config = require('config');
const starterRouter = require('./src/starter.routes');

app.listen(port, () => {
    console.log(`api is listening on ${port}`);
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
    res.send({error: err});
});

app.use('/starter', starterRouter);