var express = require('express');
var router = express.Router();
var api = require('../api/api');

router.post('/', api.createUser);
router.get('/:identifier', api.checkUniqueUserOrEmail);

module.exports = router;