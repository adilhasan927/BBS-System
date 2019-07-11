var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.get('/:userName', function(req, res, next) {
  res.send(req.params)
  var token = req.body.AuthToken;
  var username;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
      }))  
      return null;
    }
    username = val.username;
  });
  connection.then(dbs => {
    dbs.db('documents');
    res.send()
  });
});

module.exports = router;
