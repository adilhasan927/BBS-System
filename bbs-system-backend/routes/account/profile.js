var express = require('express');
var router = express.Router();
const connection = require('../../utility/db');
const sendError = require('../../utility/error');
var sizeOf = require('image-size');
const verify = require('../../utility/verify');

router.use('/', function(req, res, next) {
  const token = req.header('Authorization');
  verify(token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      req.query.tokenUsername = val.username;
      next();
    }
  })
})

router.get('/', async function(req, res, next) {
  var username = req.query.username;
  const dbs = await connection;
  dbs.db('documents')
  .collection('users')
  .findOne({ "username": username })
  .then(user => {
    res.send({
      body: {
        profile: user.profile,
        verified: user.verified,
      }
    });
  }).catch(err => {
    console.log(err);
    sendError(res, "DBError", 500);
  });
});

router.put('/', async function(req, res, next) {
  const username = req.query.tokenUsername;
  const profileText = req.body.profile.profileText;
  const profileImage = req.body.profile.profileImage;
  try {
    var imageProps = sizeOf(Buffer.from(profileImage.value, 'base64'));
  } catch(error) {
    sendError(res, "TypeError", 400);
    return null;
  }
  if (imageProps.width != 600 ||
  imageProps.height != 600) {
    sendError(res, "SizeError", 400);
    return null;
  } else if (imageProps.type != 'png') {
    sendError(res, "TypeError", 400);
    return null;
  }
  const dbs = await connection;
  dbs.db('documents')
  .collection('users')
  .updateOne(
    { "username": username },
    { $set: {
      "profile.profileText": profileText,
      "profile.profileImage": profileImage,
    } },
  ).then(val => {
    res.send();
  }).catch(err => {
    sendError(res, "DBError", 500);
  });
});

module.exports = router;
