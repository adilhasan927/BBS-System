var express = require('express');
var router = express.Router();
const connection = require('../utility/db');
const verifyUser = require('../utility/email');
const sendError = require('../utility/error');
const verify = require('../utility/verify');

router.post('/', function(req, res, next) {
  const token = req.header('Authorization');
  var username;
  verify(res, token, (err, val) => {
    if (err) {
      console.log(err);
      sendError(res, "TokenError", +err.message);
    } else {
      username = val.username;
      proceed();
    }
  })
  function proceed() {
    connection.then(dbs => {
      dbs.db('documents')
        .collection('users')
        .updateOne(
          { "username": username },
          { $set: { "verified": true } }
        ).then(val => {
          res.send(JSON.stringify({ body: true }))
        }).catch(err => {
          sendError(res, "DBError", 500);
        });
    })
  }
});

router.get('/', function(req, res, next) {
  const token = req.header('Authorization');
  var username;
  verify(res, token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      username = val.username;
      sendRes();
    }
  })
  function sendRes() {
    connection.then(dbs => { 
      dbs.db('documents')
      .collection('users')
      .findOne({ 'username': username })
      .then(val => {
        verifyUser(val.email, username);
        res.send(JSON.stringify({ body: true }));
      }).catch(err => {
        console.log(err);
        sendError(res, "DBError", 500);
      });
    });
  }
});

module.exports = router;
