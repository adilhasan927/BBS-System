var express = require('express');
var router = express.Router();
const jwt =  require('jsonwebtoken');
const connection = require('../db.js');
const getSecret = require('../secrets');
const verifyUser = require('../email');

router.post('/', function(req, res, next) {
  const token = req.body.AuthToken;
  var username;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
      }));
    } else {
      username = val.username;
      sendRes();
    }
  });
  function sendRes() {
    connection.then(dbs => { 
      dbs.db('documents')
      .collection('users')
      .findOne({ 'username': username })
      .then(val => {
        verifyUser(val.email, username);
      });
    });
  }
});

module.exports = router;