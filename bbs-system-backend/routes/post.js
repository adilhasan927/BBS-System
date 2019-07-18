const express = require('express');
var router = express.Router();
const connection = require('../db.js')
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const sendError = require('../error');

router.get('/', function(req, res, next) {
  const token = req.header('AuthToken');
  const position = JSON.parse(req.header('position'));
  const limit = JSON.parse(req.header('limit'));
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      sendError(res, "TokenError");
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
      .limit(limit)
      .toArray()
      .then(arr => {
        res.send(JSON.stringify({
          successful: true,
          body: arr,
        }));
      });
    }).catch(err => {
      console.log(err);
      sendError(res, "DBError");
    });
  }
});

router.post('/', function(req, res, next) {
  const token = req.body.AuthToken;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      sendError(res, "TokenError", 401);
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
          body: val.ops[0]._id,
        }));
      }).catch(err => {
        console.log(err);
        sendError(res, "DBError", 500);
      });
    });
  }
});

module.exports = router;
