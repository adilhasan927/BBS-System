const validator = require('validator')
const sendError = require('./error');

function username(res, str) {
  if (!validator.isAlphanumeric(str)
  || !validator.isLength(str, {min:0})) {
    sendError(res, 'FieldError');
  }
  return false;
}
function password(res, str) {
  if (!validator.isAlphanumeric(str)
  || !validator.isLength(str, {min:0})) {
    sendError(res, 'FieldError');
  }
  return false;
}
function email(res, str) {
  if (!validator.isEmail(str)) {
    sendError(res, 'FieldError');
  }
  return false;
}
module.exports = {
  username: username,
  password: password,
  email: email,
}