module.exports = function verifyUser(link) {}
const nodemailer = require('nodemailer');

// Refactor to use real email address.
module.exports = function verifyUser(address, link) {
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