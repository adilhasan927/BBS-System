const express = require('express');
var router = express.Router();
const connection = require('../db.js')
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.post('/', function(req, res, next) {
  var token = req.body.AuthToken
  var username
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
      }))  
      return null;
    }
    username = val.username
  })
  connection.then(dbs => {
      dbs.db('documents')
      .collection('credentials')
      .find({ token: token })
      .count()
      .then(val => {
        if (val == 1) {
            dbs.db("documents")
            .collection("posts")
            .insertOne({
              username: username,
              body: req.body.body,
            }).then(val => {
              res.send(JSON.stringify({
                successful: true,
              }));
            });
        } else {
          res.send(JSON.stringify([{
            successful: false,
          }]));
        }
    });
  });
});

module.exports = router;
