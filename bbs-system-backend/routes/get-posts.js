const express = require('express');
var router = express.Router();
const connection = require('../db.js')

// TODO: Add user authorisation check.
router.get('/', function(req, res, next) {
  connection.then(dbs => {
    var cursor = dbs.db('documents').collection('posts').find().sort({_id:1}).limit(5);
    cursor.toArray().then(posts => {
      res.send(JSON.stringify(posts));    
    });
  })
});

module.exports = router;
