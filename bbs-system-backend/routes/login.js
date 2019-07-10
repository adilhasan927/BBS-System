var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.post('/', function(req, res, next) {
  connection.then(dbs => {
    payload = JSON.stringify({
      username: req.body.username,
      timestamp: Date.now().toString(),
    })
    token = jwt.sign(payload, getSecret())
    dbs.db("documents")
    .collection("credentials")
    .updateOne(
      {
        username: req.body.username,
        password: req.body.password,
      },
      { $set: { token: token } },
    ).then(val => {
      res.send(JSON.stringify({
        successful: true,
        token: token,
      }));
    }).catch(err => {
      res.send(JSON.stringify({
        successful: false,
        token: null,
      }));
    });
  });
});

module.exports = router;
