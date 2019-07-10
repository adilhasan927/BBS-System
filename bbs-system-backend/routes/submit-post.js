const express = require('express');
var router = express.Router();
const connection = require('../db.js')

router.post('/', function(req, res, next) {
  connection.then(dbs => {
      dbs.db('documents')
      .collection('credentials')
      .find({ token: req.body.AuthToken })
      .count()
      .then(val => {
        if (val == 1) {
            dbs.db("documents")
            .collection("posts")
            .insertOne({
              username: req.body.AuthToken.split('@')[0],
              body: req.body.body,
            }).then(val => {
              res.send(JSON.stringify({
                authSuccessful: true,
              }));
            });
        } else {
          console.log(val)
          res.send(JSON.stringify([{
            authSuccessful: false,
          }]));
        }
    });
  });
});

module.exports = router;
