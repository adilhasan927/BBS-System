const crypto = require('crypto')
const fs = require('fs')
const jsonwebtoken = require('jsonwebtoken')

var secret;
fs.readFile('./secret.json', (err, data) => {
    secret = JSON.parse(data);
})

function getSecret() {
    if (secret.month != Date.prototype.getMonth()) {
        secret.secret = crypto.randomBytes(16);
        secret.month != Date.prototype.getMonth();
        fs.writeFile('./secret.json');
    }
    return secret.secret;
}

module.exports = getSecret;