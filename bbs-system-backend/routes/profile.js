var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.get('/', function(req, res, next) {
  var username = req.query.username;
  var token =  req.header('AuthToken');
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
      }));
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
          body: user.profile.profileText,
        }));
      }).catch(err => {
        console.log(err);
        res.send(JSON.stringify({
          successful: false,
          body: null,
        }));
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
