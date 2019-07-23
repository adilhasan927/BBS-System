const validator = require('validator')
const sendError = require('./error');

function username(res, str) {
  if (!validator.isAlphanumeric(str)
  || !validator.isLength(str, {min:6})) {
    return false;
  }
  return true;
}
function password(res, str) {
  if (!validator.isAlphanumeric(str)
  || !validator.isLength(str, {min:6})) {
    return false;
  }
  return true;
}
function email(res, str) {
  if (!validator.isEmail(str)) {
    return false;
  }
  return true;
}
module.exports = {
  username: username,
  password: password,
  email: email,
}