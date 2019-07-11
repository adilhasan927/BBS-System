var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.get('/:username', function(req, res, next) {
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .find({ username: req.params.username })
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
  res.send(req.params)
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
  var post = req.body.post;
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .updateOne(
      { "username": username },
      { $set: { "profile.profileText": "post"} }
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
