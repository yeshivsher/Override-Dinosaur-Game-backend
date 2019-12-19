starterStore = require('./starter.store');

function getFunction(req, res, next) {

    return starterStore.getFunction()
        .then((data) => res.send(data))
        .catch(err => Promise.reject(err))
}

module.exports = {
    getFunction
}