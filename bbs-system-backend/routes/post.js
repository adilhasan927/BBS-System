const express = require('express');
var router = express.Router();
const connection = require('../db.js');
const ObjectId = require('mongodb').ObjectID;
const sendError = require('../error');
const verify = require('../verify');

router.get('/', function(req, res, next) {
  var token = req.header('Authorization');
  const position = JSON.parse(req.query.position);
  const limit = JSON.parse(req.query.limit);
  const listingID = req.query.listingID;
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
    if (listingID.slice(0, 5) == 'user.') {
      if (listingID.slice(5) != username) {
        sendError(res, "PermissionsError", 403);
        return null;
      }
    }
    connection.then(dbs => {
      dbs.db('documents')
      .collection('subforums')
      .aggregate([
        { $match: { name: listingID }},
        { $unwind: '$posts' },
        { $skip: position },
        { $limit: limit },
        { $replaceRoot: { newRoot: '$posts' } }
      ])
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
  const listingID = req.query.listingID;
  const body = req.body.body;
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
    if (listingID.slice(0, 5) == 'user.') {
      if (listingID.slice(5) != username) {
        sendError(res, "PermissionsError", 403);
        return null;
      }
    }
    connection.then(dbs => {
      const id = new ObjectId();
      dbs.db("documents")
      .collection("subforums")
      .updateOne({
        name: listingID,
      }, {
        $push: { posts: {
          _id: id,
          username: username,
          body: body,
          comments: [],
        } }
      }).then(val => {
        res.send(JSON.stringify({
          successful: true,
          body: id,
        }));
      }).catch(err => {
        console.log(err);
        sendError(res, "DBError", 500);
      });
    });
  }
});

module.exports = router;
