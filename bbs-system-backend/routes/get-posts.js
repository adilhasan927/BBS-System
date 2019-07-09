const express = require('express');
var router = express.Router();
const connection = require('../db.js')

// TODO: Add user authorisation check.
router.get('/', function(req, res, next) {
  connection.then(dbs => {
    if (req.header('AuthToken') != '0') {
      if (console.log(dbs.db('documents')
      .collection('credentials')
      .find({ token: req.header('AuthToken') })
      .toArray()) != []) {
        var cursor = dbs.db('documents')
        .collection('posts')
        .find()
        .sort({_id:1})
        .limit(5);
        cursor.toArray().then(posts => {
          res.send(JSON.stringify(posts));    
        });    
      }
    } else {
      throw new Error("Invalid token.") 
    }
  }).catch(err => {
    res.send(JSON.stringify([{
      username: "Placeholder",
      body: err.toString(),
    }]));
  });
});

module.exports = router;
