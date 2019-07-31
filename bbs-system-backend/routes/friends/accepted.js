var express = require('express');
var router = express.Router();
var connection = require('../../utility/db');
const sendError = require('../../utility/error');
const verify = require('../../utility/verify');

// authorisation.
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
  const tokenUsername = req.query.tokenUsername;
  const username = req.query.username;
  connection.then(dbs => {
    // if no username query param return list of friends.
    if (!username) {
      dbs.db('documents')
      .collection('users')
      .aggregate([
        { $match: { username: tokenUsername } },
        { $unwind: "$friends" },
        { $replaceRoot: { newRoot: "$friends" } },
        { $project: { username: 1 } }
      ]).toArray()
      .then(friends => {
        res.send(friends);
      }).catch(err => {
        sendError(res, "DBError", 500);
      })
    // else return if queried user is friend.
    } else {
      dbs.db('documents')
      .collection('users')
      .findOne({
        username: tokenUsername,
        friends: { username: username}
      })
      .then(user => {
        // send true if matching user exists, else false.
        res.send(user ? true : false);
      }).catch(err => {
        sendError(res, "DBError", 500);
      })
    }
  })
})

router.delete('/', function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const username = req.query.username;
  // remove friend from friends array.
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .updateMany(
      { username: { $in: [tokenUsername, username] } },
      { $pull: { friends: { username: { $in: [tokenUsername, username] } } } }
    ).then(val =>{
      res.send();
    }).catch(err => {
      sendError(res, "DBError", 500);
    })
  })
})

module.exports = router;