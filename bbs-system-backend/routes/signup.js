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
    .insertOne({
      username: req.body.username,
      password: req.body.password,
      profile: {
        profileText: "",
      },
    }).then(val => {
      res.send(JSON.stringify({
        successful: true,
        body: token,
      }));
    }).catch(err => {
      res.send(JSON.stringify({
        successful: false,
        body: null,
      }));
    });
  });
});

module.exports = router;
