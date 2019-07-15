var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const request = require('request');
const querystring = require('querystring');

router.post('/', function(req, res, next) {
  request({
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    json: false,
    body: querystring.stringify({
      secret: '6Ld4qa0UAAAAABt7D4dM3FwzOrmUnNI9TLF3e4-f',
      response: req.body.captchaResponse })
    },
    (err, result, body) => {
      if (err) {
        console.log(err);
        res.send(JSON.stringify({
          successful: false,
          body: null,
          captchaSuccess: null,
        }));
      } else if (!JSON.parse(body).success) {
        res.send(JSON.stringify({
          successful: false,
          body: null,
          captchaSuccess: false,
        }));  
      } else procede();
    });
  function procede() {
    connection.then(dbs => {
      var payload = {
        username: req.body.credentials.username,
      }
      var token = jwt.sign(payload, getSecret(), { expiresIn: "2 days" });
      dbs.db("documents")
      .collection("users")
      .insertOne({
        username: req.body.credentials.username,
        password: req.body.credentials.password,
        profile: {
          profileText: "",
        },
      }).then(val => {
        res.send(JSON.stringify({
          successful: true,
          body: token,
          captchaSuccess: true,
        }));
      }).catch(err => {
        console.log(err);
        res.send(JSON.stringify({
          successful: false,
          body: null,
          captchaSuccess: true,
        }));
      });
    });
  }
});

module.exports = router;
