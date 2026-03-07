const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail', 
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, 
//   },
// });


const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,   
    pass: process.env.BREVO_PASS,  
  },
});

module.exports = transporter;