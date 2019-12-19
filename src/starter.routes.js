const router = require('express').Router();
const starterController = require('./starter.controller');

module.exports = router;

router.get('/getFunction', starterController.getFunction);