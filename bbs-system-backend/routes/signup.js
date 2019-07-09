var express = require('express');
var router = express.Router();
const connection = require('../db.js');

router.post('/', function(req, res, next) {
  console.log(req);
  connection.then(dbs => {
    token = Math.round(Math.random() * 10^4).toString();
    dbs.db('documents').collection('credentials').insertOne({
      username: req.body.username,
      password: req.body.password,
      token: token,
    });
    return token;
  }).then(token => {
    res.send(JSON.stringify({
      authSuccessful: true,
      token: token,
    }));
  }).catch(err => {
    res.send(JSON.stringify({
      authSuccessful: false,
      token: 0,
    }))
  });
});

module.exports = router;
