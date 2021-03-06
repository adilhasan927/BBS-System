const express = require('express');
var router = express.Router();
const connection = require('../utility/db');
const sendError = require('../utility/error');
const verify = require('../utility/verify');
const captcha = require('../utility/captcha');
const createSubforum = require('../utility/forums');

router.use('/post', function(req, res, next) {
  captcha(req.body.captchaResponse,
    (err, result, body) => {
      if (err) {
        console.log(err);
        sendError(res, err, 500);
      } else if (!JSON.parse(body).success) {
        console.log(body);
        sendError(res, "CaptchaError", 401);
      } else next();
    });
})

router.use('/', function(req, res, next) {
  const token = req.header('Authorization');
  verify(token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      req.query.username = val.username;
      next();
    }
  })
})

router.post('/', async function(req, res, next) {
  const listingID = req.body.listingID;
  const description = req.body.description;
  const username = req.query.username;
  console.log(listingID);
  if (listingID.slice(0, 5) != 'main.') {
    sendError(res, "PermissionsError", 403);
    return null;
  }
  const dbs = await connection;
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

module.exports = router
