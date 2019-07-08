var express = require('express');
var router = express.Router();

// TODO: Add proper request handling.
router.post('/', function(req, res, next) {
  console.log(req);
  res.send(JSON.stringify({
    authSuccessful: true,
    token: "123456",
  }));
});

module.exports = router;
