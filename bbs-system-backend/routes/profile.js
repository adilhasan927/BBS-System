var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const getSecret = require('../secrets.js');
const sendError = require('../error');
var sizeOf = require('image-size');

router.get('/', function(req, res, next) {
  var username = req.query.username;
  var token =  req.header('AuthToken');
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      sendError("TokenError");
    } else {
      sendRes();
    }
  });
  function sendRes() {
    connection.then(dbs => {
      dbs.db('documents')
      .collection('users')
      .findOne({ "username": username })
      .then(user => {
        res.send(JSON.stringify({
          successful: true,
          body: {
            profile: user.profile,
            verified: user.verified,
          }
        }));
      });
    }).catch(err => {
      console.log(err);
      sendError("DBError");
    });
  }
});

router.post('/', function(req, res, next) {
  var token = req.body.AuthToken;
  var username;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      sendError(res, "TokenError");
    } else {
      username = val.username;
      sendRes();
    }
  });
  function sendRes() {
    const profileText = req.body.profile.profileText;
    const profileImage = req.body.profile.profileImage;
    try {
      var imageProps = sizeOf(new Buffer(profileImage.value, 'base64'));
    } catch(error) {
      console.log(error)
      sendError(res, "TypeError");
      return null;
    }
    console.log(imageProps)
    if (imageProps.width != 600 ||
    imageProps.height != 600) {
      sendError(res, "SizeError");
      return null;
    } else if (imageProps.type != 'png') {
      sendError(res, "TypeError");
      return null;
    }
    connection.then(dbs => {
      dbs.db('documents')
      .collection('users')
      .updateOne(
        { "username": username },
        { $set: {
          "profile.profileText": profileText,
          "profile.profileImage": profileImage,
        } },
      ).then(val => {
        res.send({
          successful: true,
          body: null,
        });
      }).catch(err => {
        sendError("DBError");
      });
    });
  }
});

module.exports = router;
