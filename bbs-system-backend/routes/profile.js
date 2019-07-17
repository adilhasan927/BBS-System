var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const sendError = require('../error');
const validators = require('../validators');

router.get('/', function(req, res, next) {
  var username = req.query.username;
  var token =  req.header('AuthToken');
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      sendError("TokenError");
    } else {
      sendRes();
    }
  });
  function sendRes() {
    connection.then(dbs => {
      dbs.db('documents')
      .collection('users')
      .findOne({ "username": username })
      .then(user => {
        res.send(JSON.stringify({
          successful: true,
          body: {
            profile: user.profile,
            verified: user.verified,
          }
        }));
      }).catch(err => {
        console.log(err);
        sendError("DBError");
      });
    });
  }
});

router.post('/', function(req, res, next) {
  var token = req.body.AuthToken;
  var username;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
      }))  
    } else {
      username = val.username;
      sendRes();
    }
  });
    function sendRes() {
    var profileText = req.body.profile;
    connection.then(dbs => {
      dbs.db('documents')
      .collection('users')
      .updateOne(
        { "username": username },
        { $set: { "profile.profileText": profileText } },
      ).then(val => {
        res.send({
          successful: true,
          body: null,
        });
      }).catch(err => {
        res.send({
          successful: false,
          body: null,
        });
      });
    });
  }
});

module.exports = router;
