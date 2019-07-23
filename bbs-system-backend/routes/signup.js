var express = require('express');
var router = express.Router();
const connection = require('../utility/db');
const jwt = require('jsonwebtoken');
const getSecret = require('../utility/secrets');
const captcha = require('../utility/captcha');
const verifyUser = require('../utility/email');
const sendError = require('../utility/error');
const validators = require('../utility/validators');

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
    const username = req.body.credentials.username;
    const password = req.body.credentials.password;
    const email = req.body.credentials.email;
    var valid = validators.username(res, username)
    && validators.password(res, password)
    && validators.email(res, email);
    if (!valid) {
      sendError(res, 'FieldError', 400);
      return null;
    }
    var payload = {
      username: username,
    }
    var token = jwt.sign(payload, getSecret(), { expiresIn: "2 days" } );
    verifyUser(email, username);
    connection.then(dbs => {
      dbs.db("documents")
      .collection("users")
      .insertOne({
        username: username,
        password: password,
        profile: {
          profileText: null,
          profileImage: null,
        },
        email: email,
        verified: false,
        admin: false
      }).then(val => {
        dbs.db("documents")
        .collection("subforums")
        .insertOne({
          name: "user." + username,
          posts: [],
        })
        .then( val => {
          res.send(JSON.stringify({
            successful: true,
            body: token,
            captchaSuccess: true,
          }));
        });
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
