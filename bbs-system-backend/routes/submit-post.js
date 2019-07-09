var express = require('express');
var router = express.Router();
const connection = require('../db.js');

router.post('/', function(req, res, next) {
    connection.then(dbs => {
        dbs.db('documents').collection('posts');
        res.send();
    });
});