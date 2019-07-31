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
  // get friend requests array.
  connection.then(dbs => {
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
})

router.delete('/', function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const username = req.query.username;
  const accepted = JSON.parse(req.query.accept);
    connection.then(dbs => {
      // delete from friend requests array.
      dbs.db('documents')
      .collection('users')
      .updateOne(
        { username: tokenUsername },
        { $pull: { friendRequests: { username: username } } }
      ).catch(err => { throw err; })
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
      }}
    ).then(responses => res.send())
    .catch(errs => {
      sendError(res, "DBError", 500);
    })
})

module.exports = router;
