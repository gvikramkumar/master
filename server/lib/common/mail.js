const nodemailer = require('nodemailer'),
  Q = require('q');

// keeps nodemailer from complaining about self signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const transporter = nodemailer.createTransport({
  host: 'mail.cisco.com',
  secure: false,
  port: 25
});


module.exports = {
  send
}

function send(from, to, subject, text, html) {
  let mailOptions = {from, to, subject, text, html};
  return Q.ninvoke(transporter, 'sendMail', mailOptions);
}

