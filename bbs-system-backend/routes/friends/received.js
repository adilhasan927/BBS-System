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

router.get('/', async function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const dbs = await connection;
  // get friend requests array.
  dbs.db('documents')
  .collection('users')
  .aggregate([
    { $match: { username: tokenUsername } },
    { $unwind: "$friendRequests" },
    { $replaceRoot: { newRoot: "$friendRequests" } },
    { $project: { username: 1 } }
  ]).toArray()
  .then(friendRequests => {
    res.send(friendRequests);
  }).catch(err => {
    console.log(err);
    sendError(res, "DBError", 500);
  })
})

router.delete('/', async function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const username = req.query.username;
  const accepted = JSON.parse(req.query.accept);
  const dbs = await connection;
  // delete from friend requests array.
  dbs.db('documents')
  .collection('users')
  .updateOne(
    { username: tokenUsername },
    { $pull: { friendRequests: { username: username } } }
  ).catch(err => { throw err; })
  .then(_ => {
  // add to friends array of both users if accepted.
  if (accepted) {
    // add query param friend to token user.
    dbs.db('documents')
    .collection('users')
    .updateOne(
      { username: { $in: [username] } },
      { $push: { friends: { username: tokenUsername } } 
    }).catch(err => { throw err; });
    // add token friend to query param user.
    dbs.db('documents')
    .collection('users')
    .updateOne(
      { username: { $in: [tokenUsername] } },
      { $push: { friends: { username: username } } 
    }).catch(err => { throw err; });
  }})
  .then(responses => res.send())
  .catch(err => { sendError(res, "DBError", 500); });
})

module.exports = router;
