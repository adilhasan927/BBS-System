var express = require('express');
var router = express.Router();
const connection = require('../db.js');

router.post('/', function(req, res, next) {
  connection.then(dbs => {
    dbs.db("documents")
    .collection("credentials")
    .updateOne(
      { token: req.body.token },
      { $set: { token: '0' } },
    ).then(val => {
      res.send(JSON.stringify({
        logoutSuccessful: true,
      }));
    }).catch(err => {
      res.send(JSON.stringify({
        logoutSuccessful: false,
      }));
    });
  });
});

module.exports = router;
