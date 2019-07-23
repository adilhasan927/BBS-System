const crypto = require('crypto')
const fs = require('fs')
const jsonwebtoken = require('jsonwebtoken')

//todo: implement proper secret generation.
module.exports = function getSecret() {
    return "445d327cf6b58463ea4453a167ff6894"
}