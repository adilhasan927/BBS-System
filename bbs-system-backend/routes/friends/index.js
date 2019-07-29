var express = require('express');
var router = express.Router()

var acceptedRouter = require('./accepted');
var sentRouter = require('./sent');
var receivedRouter = require('./received');

router.use('/accepted', acceptedRouter);
router.use('/sent', sentRouter);
router.use('/received', receivedRouter);

module.exports = router;
