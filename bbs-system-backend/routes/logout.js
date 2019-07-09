var express = require('express');
var router = express.Router();

// TODO: Add proper request handling.
router.get('/', function(req, res, next) {
  console.log(req);
  res.send(JSON.stringify({
    logoutSuccessful: true,
  }));
});

module.exports = router;
