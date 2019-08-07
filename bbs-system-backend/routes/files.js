const express = require('express');
const router = express.Router();

const path = require('path');

const sendError = require('../utility/error');
const verify = require('../utility/verify');

const mime = require('mime');

const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.' + mime.getExtension(file.mimetype))
  },
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024^2 }
}).single('upload');

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
  res.sendFile(path.resolve(`./uploads/${req.query.filename}`),
    { headers: {'Content-Type': 'image/png'} }, err => {
    if (err) {
      sendError(res, 'FileNotFoundError', 404);
      console.error('Error', err);
    }
  })
})

router.post('/', upload, function(req, res, next) {
  upload(req, res, function(err) {
    if (err.message == "File too large") {
      sendError("FileTooLongError");
    }
  })
  res.json(req.file.filename);
})

module.exports = router;
