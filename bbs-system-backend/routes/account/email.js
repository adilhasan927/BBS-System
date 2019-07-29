var express = require('express');
var router = express.Router();
const connection = require('../../utility/db');
const verifyUser = require('../../utility/email');
const sendError = require('../../utility/error');
const verify = require('../../utility/verify');

router.use('/', function(req, res, next) {
  verify(token, (err, val) => {
    if (err) {
      console.log(err);
      sendError(res, "TokenError", +err.message);
    } else {
      req.query.username = val.username;
      next();
    }
  })
})

router.post('/', function(req, res, next) {
  const username = req.query.username;
  connection.then(dbs => {
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
  })
});

router.get('/', function(req, res, next) {
  const username = req.query.username;
  connection.then(dbs => { 
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
});

module.exports = router;
