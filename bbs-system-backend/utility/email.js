const nodemailer = require('nodemailer');
const getSecret = require('./secrets');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

/**
 * Send verification email to user.
 * @param {string} address 
 * @param {string} username 
 */
function verifyUser(address, username) {
    const link = config.frontendFqdn
    + "/verify-email/"
    + jwt.sign({
        //emailed: true,
        username: username,
    }, getSecret(), { expiresIn: "2 days"} );
    console.log("username:" + username);
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'lennie.goldner70@ethereal.email',
            pass: 'q7Tkk8WaCaPmZda51U'
        }
    });
    const message = {
        from: 'sender@example.com',
        to: address,
        subject: 'Verify your account.',
        text: `Verification link: ${link}.`,
        html: `<a href=${link}>Verification link.</a>`
    }
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = verifyUser;
