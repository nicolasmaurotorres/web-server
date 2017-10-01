var express = require('express');
var router = express.Router();
var api = require('../api/api');


router.post('/',api.authenticate ,api.createEvent);

module.exports = router;
