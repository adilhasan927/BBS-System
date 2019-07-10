const express = require('express');
var router = express.Router();
const connection = require('../db.js')
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');

router.get('/', function(req, res, next) {
  const token = req.header('AuthToken')
  var timestamp
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      res.send(JSON.stringify({
        successful: false,
        arr: [],
      }))  
      return null;
    }
    timestamp = Number(val.timestamp)
  })
  if ((Date.now() - timestamp) > (1000*60*60*24)) {
    res.send(JSON.stringify({
      successful: false,
      arr: [],
    }))
  } 
  connection.then(dbs => {
    dbs.db('documents')
    .collection('credentials')
    .find({ token: token })
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
          res.send(JSON.stringify({
            successful: true,
            arr: arr,
          }));
        });
      } else {
        console.log(val)
        res.send(JSON.stringify([{
          successful: false,
          arr: [],
        }]));
      }
    });
  });
});

module.exports = router;
