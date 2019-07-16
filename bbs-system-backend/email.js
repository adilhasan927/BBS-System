const nodemailer = require('nodemailer');
const getSecret = require('./secrets');
const jwt = require('jsonwebtoken');

// Refactor to use real email address.
module.exports = function verifyUser(address, username) {
    const link = "http://localhost:3000"
    + "/api/verify?token="
    + jwt.sign( {
        email: address,
        username: username,
    }, getSecret(), { expiresIn: "2 days"} );
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