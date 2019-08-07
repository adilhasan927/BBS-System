const validator = require('validator')

/**
 * Usernames must be alphanumeric strings of at least 6 characters.
 * @param {import('express').Response} res 
 * @param {string} username 
 */
function username(res, username) {
  if (!validator.isAlphanumeric(username)
  || !validator.isLength(username, {min:6})) {
    return false;
  }
  return true;
}

/**
 * Passwords must be alphanumeric stings of at least 6 characters.
 * @param {import('express').Response} res 
 * @param {string} password 
 */
function password(res, password) {
  if (!validator.isAlphanumeric(password)
  || !validator.isLength(password, {min:6})) {
    return false;
  }
  return true;
}

/**
 * Email addresses must be alphanumeric strings of at least 6 characters.
 * @param {import('express').Response} res 
 * @param {string} address 
 */
function email(res, address) {
  if (!validator.isEmail(address)) {
    return false;
  }
  return true;
}

module.exports = {
  username: username,
  password: password,
  email: email,
}
