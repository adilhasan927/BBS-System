const express = require('express');
var router = express.Router();
const connection = require('../utility/db');
const sendError = require('../utility/error');
const verify = require('../utility/verify');
const createSubforum = require('../utility/forums');

router.post('/', function(req, res, next) {
  const token = req.header('Authorization');
  const listingID = req.body.listingID;
  var username;
  verify(res, token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      username = val.username;
      sendRes();
    }
  })
  function sendRes() {
    if (listingID.slice(0, 5) == 'user.') {
      sendError(res, "PermissionsError", 403);
      return null;
    }
    connection.then(dbs => {
      createSubforum(res, dbs, listingID, username)
      .then(val => {
        res.send();
      }).catch(err => {
        sendError(res, "DBError", 500);
      })
    });
  }
});

module.exports = router;
