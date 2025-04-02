const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'Mironov <hello@miron.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the mail
  transporter.sendMail(options);
};

module.exports = sendEmail;
