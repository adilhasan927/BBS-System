var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const captcha = require('../captcha');
const verifyUser = require('../email');

router.post('/', function(req, res, next) {
  captcha(
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
    const username = req.body.credentials.username;
    const password = req.body.credentials.password;
    const email = req.body.credentials.email;
    var payload = {
      username: username,
    }
    var token = jwt.sign(payload, getSecret(), { expiresIn: "2 days" } );
    var emailLink = "localhost:4200" 
      + "/api/verify?token="
      + jwt.sign(email, getSecret(), { expiresIn: "2 days"} );
    verifyUser(emailLink);
    connection.then(dbs => {
      dbs.db("documents")
      .collection("users")
      .insertOne({
        username: username,
        password: password,
        profile: {
          profileText: "",
        },
        email: email,
        verified: false,
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
