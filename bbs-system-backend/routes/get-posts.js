const express = require('express');
var router = express.Router();

// TODO: Add proper request handling.
router.get('/', function(req, res, next) {
  console.log(req);
  res.send(JSON.stringify([
    { author: 'author1', body: 'body1' },
    { author: 'author2', body: 'body2' },
  ]));
});

module.exports = router;
