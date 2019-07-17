var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const sendError = require('../error');
const validators = require('../validators');

router.post('/', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  var valid = validators.username(res, username)
  && validators.password(res, password)
  if (!valid) {
    return null;
  }
  connection.then(dbs => {
    var payload = {
      username: username,
    }
    var token = jwt.sign(payload, getSecret(), { expiresIn: "2 days" });
    dbs.db("documents")
    .collection("users")
    .find({
      username: username,
      password: password,
    })
    .count()
    .then(val => {
      if (val == 1) {
        res.send(JSON.stringify({
          successful: true,
          body: token,
        }));
      } else {
        sendError(res, "CredentialsError" );
      }
    });
  }).catch(err => {
    console.log(err);
    sendError(res, "DBError");
  });
});

module.exports = router;
