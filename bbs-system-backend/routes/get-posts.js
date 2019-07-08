const express = require('express');
var router = express.Router();

// TODO: Add proper request handling.
router.get('/', function(req, res, next) {
  console.log(req);
  res.send(JSON.stringify([
    { username: 'author1', body: 'body1' },
    { username: 'author2', body: 'body2' },
  ]));
});

module.exports = router;
