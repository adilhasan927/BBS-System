var express = require('express');
var router = express.Router();
const connection = require('../db.js');

router.post('/', function(req, res, next) {
  connection.then(dbs => {
    token = req.body.username + '@' + req.body.password;
    dbs.db("documents")
    .collection("credentials")
    .insertOne({
      username: req.body.username,
      password: req.body.password,
      token: token,
    }).then(val => {
      res.send(JSON.stringify({
        authSuccessful: true,
        token: token,
      }));
    }).catch(err => {
      res.send(JSON.stringify({
        authSuccessful: false,
        token: 0,
      }));
    });
  });
});

module.exports = router;
