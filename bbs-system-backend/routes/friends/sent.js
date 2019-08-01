var express = require('express');
var router = express.Router();
var connection = require('../../utility/db');
const sendError = require('../../utility/error');
const verify = require('../../utility/verify');

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

router.get('/', async function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const username = req.query.username;
  const dbs = await connection;
  // send true if friend or friend request sent, otherwise false.
  dbs.db('documents')
  .collection('users')
  .find({
    username: username,
    $or: [
      { friends: { $elemMatch: { username: tokenUsername } } },
      { friendRequests: { $elemMatch: { username: tokenUsername } } },
    ]
  })
  .count()
  .then(num => {
    if (num) {
      res.send(true);
    } else {
      res.send(false);
    }
  })
})

router.post('/', async function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const username = req.body.username;
  // add to friend requests array if not already present.
  const dbs = await connection;
  // see if any such request already in array.
  dbs.db('documents')
  .collection('users')
  .find({
    username: username,
    friendRequests: { $elemMatch: { username: tokenUsername } }
  })
  .count()
  .then(num => {
    console.log(num);
    // if matching request not in array.
    if (!num) {
      // add request to friend requests array.
      dbs.db('documents')
      .collection('users')
      .updateOne(
        { username: username },
        { $push: { friendRequests: {
          username: tokenUsername
        } } }
      ).then(val => res.send())
      .catch(err => { throw err; })
    } else {
      res.send()
    }
  }).catch(err => {
    sendError(res, "DBError", 500);
  })
})

module.exports = router;
