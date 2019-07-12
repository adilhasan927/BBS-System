const express = require('express');
var router = express.Router();
const connection = require('../db.js')
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const crypto = require('crypto')

router.get('/', function(req, res, next) {
  const token = req.header('AuthToken');
  const position = JSON.parse(req.header('position'));
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
        body: [],
      }))
    } else {
      sendRes();
    }
  })
  function sendRes() {
    connection.then(dbs => {
      dbs.db('documents')
      .collection('posts')
      .find()
      .sort({ _id: -1 })
      .skip(position)
      .limit(20)
      .toArray()
      .then(arr => {
        res.send(JSON.stringify({
          successful: true,
          body: arr,
        }));
      });
    });
  }
});

router.post('/', function(req, res, next) {
  const token = req.body.AuthToken;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
      }))  
    } else {
      username = val.username;
      sendRes();
    }
  })
  function sendRes() {
    connection.then(dbs => {
      dbs.db("documents")
      .collection("posts")
      .insertOne({
        username: username,
        body: req.body.body,
        comments: [],
      }).then(val => {
        res.send(JSON.stringify({
          successful: true,
        }));
      }).catch(err => {
        console.log(err);
      });
    });
  }
});

module.exports = router;
