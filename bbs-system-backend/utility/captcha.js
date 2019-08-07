const request = require('request');
const querystring = require('querystring');

/**
 * Verify reCaptcha response through Google reCaptcha API.
 * @param {import('express').Response} response 
 * @param {import('request').RequestCallback} callback 
 */
function captcha(response, callback) {
  request({
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    json: false,
    body: querystring.stringify({
      secret: '6Ld4qa0UAAAAABt7D4dM3FwzOrmUnNI9TLF3e4-f',
      response: response
    })
  }, callback);
}

module.exports = captcha;
