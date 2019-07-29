var express = require('express');
var router = express.Router();
var connection = require('../../utility/db');
const sendError = require('../../utility/error');

router.use('/', function(req, res, next) {
  const token = req.header('Authorization');
  verify(token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      req.query.tokenUsername = val.username;
      next();
    }
  })
})

router.get('/', function(req, res, next) {
  const username = req.query.tokenUsername;
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .aggregate([
      { $match: { username: tokenUsername } },
      { $unwind: "friends" },
      { $replaceRoot: { newRoot: "friends" } },
      { $filter: { accepted: false } }
    ]).toArray()
    .then(friends => {
      res.send(JSON.stringify(friends));
    }).catch(err => {
      sendError(res, "DBError", 500);
    })
  })
})

router.patch('/', function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const username = req.query.username;
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .updateOne({
      username: tokenUsername,
      "friends.username": username
    }, { $set: { "friends.$.accepted": true } })
    dbs.db('documents')
    .collection('users')
    .find({
      username: username,
      friends: { username: tokenUsername }
    })
    .count()
    .then(num => {
      if (!num) {
        dbs.db('documents')
        .collection('users')
        .updateOne(
          { username: username },
          { $push: { friends: {
            username: tokenUsername,
            accepted: true
          } } }
        ).then(val => res.send())
        .catch(err => { throw err; })
      } else {
        dbs.db('documents')
        .collection('users')
        .updateOne({
          username: username,
          "friends.username": username
        }, { $set: { "friends.$.accepted": accepted } })
      }
    }).catch(err => {
      sendError(res, "DBError", 500);
    })
  })
})

router.delete('/', function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const username = req.query.username;
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .updateOne(
      { username: tokenUsername },
      { $pull: { friends: { username: username } } }
    ).then(val => {
      res.send();
    }).catch(err => {
      sendError(res, "DBError", 500);
    })
  })
})

module.exports = router;