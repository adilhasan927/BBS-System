var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.post('/', function(req, res, next) {
  connection.then(dbs => {
    var payload = {
      username: req.body.username,
    }
    var token = jwt.sign(payload, getSecret(), { expiresIn: "2 days" });
    dbs.db("documents")
    .collection("users")
    .find({
      username: req.body.username,
      password: req.body.password,
    })
    .count()
    .then(val => {
      if (val == 1) {
        res.send(JSON.stringify({
          successful: true,
          body: token,
        }));
      } else {
        res.send(JSON.stringify({
          successful: false,
          body: null,
        }));
      }
    }).catch(err => {
      res.send(JSON.stringify({
        successful: false,
        body: null,
      }));
    });
  });
});

module.exports = router;
