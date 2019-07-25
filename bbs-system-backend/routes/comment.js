const express = require('express');
var router = express.Router();
const connection = require('../utility/db')
const ObjectID = require('mongodb').ObjectID;
const sendError = require('../utility/error');
const verify = require('../utility/verify');

router.use('/', function(req, res, next) {
  const token = req.header('Authorization');
  verify(token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      req.query.username = val.username;
      next();
    }
  })
})

router.get('/', function(req, res, next) {
  const postID = req.query.PostID;
  const position = JSON.parse(req.query.position);
  const limit = JSON.parse(req.query.limit);
  const listingID = req.query.listingID;
  connection.then(dbs => {
    dbs.db('documents')
    .collection('subforums')
    .aggregate([
      { $unwind: "$posts" },
      { $unwind: "$posts.comments" },
      { $match: {
        name: listingID,
        "posts._id": ObjectID(postID)
      } },
      { $skip: position },
      { $limit: limit },
      { $replaceRoot: { newRoot: "$posts.comments" } }
    ])
    .toArray()
    .then(comments => {
      console.log(comments);
      res.send(JSON.stringify({
        successful: true,
        body: comments,
      }));
    }).catch(err => {
      console.log(err);
      sendError(res, "DBError", 500);
    });
  });
});

router.post('/', function(req, res, next) {
  const postID = req.body.PostID;
  const listingID = req.query.listingID;
  const body = req.body.body;
  const username = req.query.username;
  connection.then(dbs => {
    dbs.db("documents")
    .collection("subforums")
    .updateOne(
      {
        name: listingID,
        "posts._id": new ObjectID(postID)
      }, { $push : {
        "posts.$.comments": { 
          username: username,
          body: body,
      } } }
    ).then(val => {
      res.send(JSON.stringify({
        successful: true,
      }));
    }).catch(err => {
      console.log(err);
      sendError(res, "DBError", 500);
    });
  });
});

module.exports = router;
