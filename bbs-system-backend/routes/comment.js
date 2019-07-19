const express = require('express');
var router = express.Router();
const connection = require('../db.js')
const ObjectID = require('mongodb').ObjectID;
const sendError = require('../error');
const verify = require('../verify');

router.get('/', function(req, res, next) {
  const token = req.header('Authorization');
  const postID = req.header('PostID');
  const position = JSON.parse(req.header('position'));
  const limit = JSON.parse(req.header('limit'));
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
      .aggregate([
        { $match: { _id: new ObjectID(postID) } },
        { $unwind: '$comments' },
        { $skip: position },
        { $limit: limit },
        { $project: {
          username: '$comments.username',
          body: '$comments.body',
        } },
      ])
      .toArray()
      .then(comments => {
        res.send(JSON.stringify({
          successful: true,
          body: comments,
        }));
      })
    }).catch(err => {
      console.log(err);
      sendError(res, "DBError", 500);
    });
  }
});

router.post('/', function(req, res, next) {
  const token = req.header('Authorization');
  const postID = req.body.PostID;
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
      .updateOne(
        { "_id": new ObjectID(postID)},
        { "$push": { "comments": {
          "username": username,
          "body": req.body.body,
        } } },
      ).then(val => {
        res.send(JSON.stringify({
          successful: true,
        }));
      }).catch(err => {
        console.log(err);
        sendError(res, "DBError", 500);
      });
    });
  }
});

module.exports = router;
