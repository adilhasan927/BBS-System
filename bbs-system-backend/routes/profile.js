var express = require('express');
var router = express.Router();
const connection = require('../db.js');
const sendError = require('../error');
var sizeOf = require('image-size');
const verify = require('../verify');

router.get('/', function(req, res, next) {
  var username = req.query.username;
  var token =  req.header('Authorization');
  verify(res, token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      sendRes();
    }
  })
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

router.put('/', function(req, res, next) {
  var token = req.header('Authorization');
  var username;
  verify(res, token, (err, val) => {
    if (err) {
      sendError(res, "TokenError", +err.message);
    } else {
      sendRes();
    }
  })
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
