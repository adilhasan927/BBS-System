var express = require('express');
var router = express.Router();
const connection = require('../db.js')

// TODO: Add proper token handling.
router.post('/', function(req, res, next) {
  console.log(req);
  connection.then(dbs => {
    dbs.db('documents').collection('credentials').insertOne({
      username: req.body.username,
      password: req.body.password,
    }).then(result => {
      res.send(JSON.stringify({
        authSuccessful: true,
        token: "123456",
      }));
    }).catch(err => {
      res.send(JSON.stringify({
        authSuccessful: false,
        token: 0,
      }))
    })
  })
});

module.exports = router;
