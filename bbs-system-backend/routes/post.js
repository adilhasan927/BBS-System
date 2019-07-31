const express = require('express');
var router = express.Router();
const connection = require('../utility/db');
const ObjectId = require('mongodb').ObjectID;
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
  const position = JSON.parse(req.query.position);
  const limit = JSON.parse(req.query.limit);
  const listingID = req.query.listingID;
  const username = req.query.username;
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
      res.send({
        successful: true,
        body: arr,
      });
    }).catch(err => {
      console.log(err);
      sendError(res, "DBError", 500);
    });
  });
});

router.post('/', function(req, res, next) {
  const listingID = req.query.listingID;
  const body = req.body.body;
  const username = req.query.username;
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
});

module.exports = router;
