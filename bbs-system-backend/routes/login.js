var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const sendError = require('../error');
const validators = require('../validators');
const captcha = require('../captcha');

router.post('/', function(req, res, next) {
  captcha(req.body.captchaResponse,
    (err, result, body) => {
      if (err) {
        console.log(err);
        sendError(res, err, 500);
      } else if (!JSON.parse(body).success) {
        console.log(body);
        sendError(res, "CaptchaError", 401);
      } else procede(); 
    });
  function procede() {
    var credentials = req.header('Authorization').replace(/^Basic\s/, '');
    credentials = Buffer.from(credentials, 'base64').toString('ascii');
    credentials = credentials.split(':');
    const username = credentials[0];
    const password = credentials[1];
    var valid = validators.username(res, username)
    && validators.password(res, password)
    if (!valid) {
      sendError(res, 'FieldError', 400);
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
          sendError(res, "CredentialsError", 401 );
        }
      }).catch(err => {
        if (err.code == '11000)') {
          sendError(res, "DuplicateError", 400)
        } else {
          sendError(res, "DBError", 500)
        }});
    });
  }
});

module.exports = router;
