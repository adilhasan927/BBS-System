const jwt = require('jsonwebtoken');
const getSecret = require('./secrets');

/**
 * Verify JWT signature.
 * @param {string} token // JWT
 * @param {import('jsonwebtoken').VerifyCallback} callback 
 * @param {boolean} bearer // Bearer scheme used? 
 */
function verifyToken(token, callback, bearer=true) {
  if (bearer) {
    if (!/^Bearer\s/.test(token)){
      console.log(token);
      callback(Error(400))
      return;
    } else {
     token = token.replace(/^Bearer\s/, '');
    }
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

module.exports = verifyToken
