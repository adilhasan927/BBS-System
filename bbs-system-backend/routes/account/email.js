var express = require('express');
var router = express.Router();
const connection = require('../../utility/db');
const verifyUser = require('../../utility/email');
const sendError = require('../../utility/error');
const verify = require('../../utility/verify');

router.use('/', function(req, res, next) {
  const token = req.header('Authorization');
  verify(token, (err, val) => {
    if (err) {
      console.log(err);
      sendError(res, "TokenError", +err.message);
    } else {
      req.query.username = val.username;
      req.query.emailed = emailed;
      next();
    }
  })
})

router.post('/', async function(req, res, next) {
  const username = req.query.username;
  const dbs = await connection;
  if (emailed) {
    dbs.db('documents')
      .collection('users')
      .updateOne(
        { "username": username },
        { $set: { "verified": true } }
      ).then(val => {
        res.send()
      }).catch(err => {
        sendError(res, "DBError", 500);
      });
  } else {
    sendError(res, "EmailNotTrueError", 403);
  }
});

router.get('/', async function(req, res, next) {
  const username = req.query.username;
  const dbs = await connection;
  dbs.db('documents')
  .collection('users')
  .findOne({ 'username': username })
  .then(val => {
    verifyUser(val.email, username);
    res.send();
  }).catch(err => {
    console.log(err);
    sendError(res, "DBError", 500);
  });
});

module.exports = router;
