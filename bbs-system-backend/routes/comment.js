const express = require('express');
var router = express.Router();
const connection = require('../db.js')
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const ObjectID = require('mongodb').ObjectID;

router.get('/', function(req, res, next) {
  const token = req.header('AuthToken');
  const postID = req.header('PostID');
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
      .aggregate([
        { $match: { _id: new ObjectID(postID) } },
        { $unwind: '$comments' },
        { $skip: position },
        { $limit: 20 },
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
      }).catch(err => {
        res.send(JSON.stringify({
          successful: false,
          body: [],
        }))
      });
    });
  }
});

router.post('/', function(req, res, next) {
  const token = req.body.AuthToken;
  const postID = req.body.PostID;
  var username;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
      }))  
    }
    username = val.username;
  })
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
      res.send(JSON.stringify({
        successful: false,
      }));
    });
  });
});

module.exports = router;
