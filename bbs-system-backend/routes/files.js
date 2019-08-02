const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const fs = require('fs');

const connection = require('../utility/db');
const sendError = require('../utility/error');
const verify = require('../utility/verify');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

router.get('/', function(req, res, next) {
  fs.readFile(`./uploads/${req.query.filename}`, (err, data) => {
    if (err) {
      sendError(res, 'FileNotFoundError', 404);
      console.error('Error', err);
    }
    res.send(data);
  });
})

router.post('/', upload.single('upload'), function(req, res, next) {
  res.json(req.file.filename);
})

module.exports = router;
