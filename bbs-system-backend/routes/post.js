const express = require('express');
var router = express.Router();
const connection = require('../db.js')
const sendError = require('../error');
const verify = require('../verify');

router.get('/', function(req, res, next) {
  var token = req.header('Authorization');
  const position = JSON.parse(req.query.position);
  const limit = JSON.parse(req.query.limit);
  verify(res, token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
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
      }).catch(err => {
        console.log(err);
        sendError(res, "DBError", 500);
      });
    });
  }
});

router.post('/', function(req, res, next) {
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
