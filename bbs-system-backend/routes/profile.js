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
      sendError(res, "TokenError", 401);
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
      sendError(res, "DBError", 500);
    });
  }
});

router.post('/', function(req, res, next) {
  var token = req.body.AuthToken;
  var username;
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      sendError(res, "TokenError", 401);
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
      sendError(res, "TypeError", 400);
      return null;
    }
    console.log(imageProps)
    if (imageProps.width != 600 ||
    imageProps.height != 600) {
      sendError(res, "SizeError", 400);
      return null;
    } else if (imageProps.type != 'png') {
      sendError(res, "TypeError", 400);
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
        sendError(res, "DBError", 500);
      });
    });
  }
});

module.exports = router;
