const express = require('express');
var router = express.Router();
const connection = require('../utility/db');
const sendError = require('../utility/error');
const verify = require('../utility/verify');
const captcha = require('../utility/captcha');
const createSubforum = require('../utility/forums');

router.post('/', function(req, res, next) {
  const token = req.header('Authorization');
  const listingID = req.body.listingID;
  const description = req.body.description;
  var username;

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
    verify(res, token, (err, val) => {
      if (err) {
        sendError(res, "TokenError", +err.message);
      } else {
        username = val.username;
        sendRes();
      }
    });
  }

  function sendRes() {
    console.log(listingID);
    if (listingID.slice(0, 5) != 'main.') {
      sendError(res, "PermissionsError", 403);
      return null;
    }
    connection.then(dbs => {
      createSubforum(dbs, listingID, username, description)
      .then(val => {
        res.send();
      }).catch(err => {
        if (err.code == '11000)') {
          sendError(res, "DuplicateError", 400)
        } else {
          sendError(res, "DBError", 500)
        }
      });
    });
  }
});

module.exports = router
