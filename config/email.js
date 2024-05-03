const { emailConfig } = require('./config/config');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(emailConfig);

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});
