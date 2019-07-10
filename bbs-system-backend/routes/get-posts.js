const express = require('express');
var router = express.Router();
const connection = require('../db.js')

router.get('/', function(req, res, next) {
  connection.then(dbs => {
    dbs.db('documents')
    .collection('credentials')
    .find({ token: req.header('AuthToken') })
    .count()
    .then(val => {
      if (val == 1) {
        dbs.db('documents')
        .collection('posts')
        .find()
        .sort({ _id: -1 })
        .limit(5)
        .toArray()
        .then(arr => {
          res.send(JSON.stringify(arr));
        });
      } else {
        console.log(val)
        res.send(JSON.stringify([{
          username: 'Placeholder',
          body: 'Incorrect token.'
        }]));
      }
    });
  });
});

module.exports = router;
