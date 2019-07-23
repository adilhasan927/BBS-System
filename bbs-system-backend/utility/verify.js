const jwt = require('jsonwebtoken');
const getSecret = require('./secrets');

module.exports = function verifyToken(res, token, callback) {
  if (!/^Bearer\s/.test(token)){
    console.log(token);
    callback(Error(400))
    return;
  } else {
    token = token.replace(/^Bearer\s/, '');
  }
  jwt.verify(token, getSecret(), (err, val) => {
    if (err) {
      callback(Error(401));
      return;
    } else {
      callback(null, val);
      return;
    }
  })
}