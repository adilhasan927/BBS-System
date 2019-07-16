var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

// Refactor code to allow resending email if verification failed.
router.get('/', function(req, res, next) {
  const token = req.query.token;
  var email;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.render('verification', { text: 'Verification failed.' });
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
          res.render('verification', { text: 'Verification succeeded.' });
        });
    })
  }
});

module.exports = router;
