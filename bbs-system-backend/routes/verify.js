var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const verifyUser = require('../email');
const sendError = require('../error');
const verify = require('../verify');

router.post('/resend', function(req, res, next) {
  const token = req.header('Authorization');
  console.log(token);
  var email;
  verify(res, token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      email = val.email;
      proceed();
    }
  })
  function proceed() {
    connection.then(dbs => {
      dbs.db('documents')
        .collection('users')
        .updateOne(
          { "email": email },
          { $set: { "verified": true } }
        ).then( val => {
          res.render('verification', {
            text: "Verification succeeded.",
            link: "http://127.0.0.1:4200/profile/",
          });
        });
    })
  }
});

router.post('/', function(req, res, next) {
  const token = req.header('Authorization');
  var username;
  verify(res, token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      username = val.username;
      proceed();
    }
  })
  function sendRes() {
    connection.then(dbs => { 
      dbs.db('documents')
      .collection('users')
      .findOne({ 'username': username })
      .then(val => {
        verifyUser(val.email, username);
      });
    }).catch(err => {
      console.log(err);
      sendError(res, "DBError", 500);
    });
  }
});

module.exports = router;
