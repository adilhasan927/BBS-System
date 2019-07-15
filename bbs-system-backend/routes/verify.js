var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.get('/', function(req, res, next) {
  connection.then(dbs => {
    dbs.db('documents').collection('users');
    res.send();
  })
});

module.exports = router;
