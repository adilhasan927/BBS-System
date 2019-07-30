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

router.get('/', function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const username = req.query.username;
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .find({
      username: username,
      friends: { $elemMatch: { username: tokenUsername } }
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
})

router.post('/', function(req, res, next) {
  const tokenUsername = req.query.tokenUsername;
  const username = req.body.username;
  connection.then(dbs => {
    dbs.db('documents')
    .collection('users')
    .find({
      username: username,
      friends: { $elemMatch: { username: tokenUsername } }
    })
    .count()
    .then(num => {
      console.log(num);
      if (!num) {
        dbs.db('documents')
        .collection('users')
        .updateOne(
          { username: username },
          { $push: { friends: {
            username: tokenUsername,
            accepted: false
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
})

module.exports = router;