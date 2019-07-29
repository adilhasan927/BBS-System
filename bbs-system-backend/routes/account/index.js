var express = require('express');
var router = express.Router();

const emailRouter = require('./email');
const profileRouter = require('./profile');

router.use('/email', emailRouter);
router.use('/profile', profileRouter);

module.exports = router;
