const express = require('express');
var router = express.Router();
const connection = require('../db.js')
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const ObjectID = require('mongodb').ObjectID;

router.get('/', function(req, res, next) {
  const token = req.header('AuthToken');
  const postID = req.header('PostID');
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
        body: [],
      }))
    }
  })
  connection.then(dbs => {
    dbs.db('documents')
    .collection('posts')
    .findOne({ _id: new ObjectID(postID)})
    .then(post => {
      res.send(JSON.stringify({
        successful: true,
        body: post.comments,
      }));
    }).catch(err => {
      res.send(JSON.stringify({
        successful: false,
        body: [],
      }))
    });
  });
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
