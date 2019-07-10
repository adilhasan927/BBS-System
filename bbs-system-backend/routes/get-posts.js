const express = require('express');
var router = express.Router();
const connection = require('../db.js')
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.get('/', function(req, res, next) {
  const token = req.header('AuthToken')
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
        body: [],
      }))
    }
  })
  connection.then(dbs => {
    dbs.db('documents')
    .collection('posts')
    .find()
    .sort({ _id: -1 })
    .limit(5)
    .toArray()
    .then(arr => {
      res.send(JSON.stringify({
        successful: true,
        body: arr,
      }));
    });
  });
});
module.exports = router;
