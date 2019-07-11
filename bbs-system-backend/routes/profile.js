var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.get('/', function(req, res, next) {
  var username  = req.body.username;
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .find({ "username": username })
    .toArray()
    .then(arr => {
      res.send({
        successful: true,
        body: arr,
      });
    }).catch(err => {
      res.send({
        successful: false,
        body: null,
      });
    });
  });
});

router.post('/', function(req, res, next) {
  var token = req.body.AuthToken;
  var username;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
      }))  
      return null;
    }
    username = val.username;
  });
  var profileText = req.body.profileText;
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .updateOne(
      { "username": username },
      { $set: { "profile.profileText": "profileText"} }
    ).then(arr => {
      res.send({
        successful: true,
        body: arr,
      });
    }).catch(err => {
      res.send({
        successful: false,
        body: null,
      });
    });
  });
});

module.exports = router;
