var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.get('/', function(req, res, next) {
  const token = req.query.token;
  console.log(token);
  var email;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.render('verification', {
        text: 'Verification failed.',
        link: 'http://127.0.0.1:4200/profile/',
      });
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
            text: 'Verification succeeded.',
            link: 'http://127.0.0.1:4200/profile/',
          });
        });
    })
  }
});

module.exports = router;
