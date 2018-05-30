const nodemailer = require('nodemailer'),
  Q = require('q'),
  config = require('../../config/get-config').mail;

// keeps nodemailer from complaining about self signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const transporter = nodemailer.createTransport({
  host: config.host,
  secure: config.secure,
  port: config.port
});

module.exports = {
  send
}

function send(from, to, subject, text, html) {
  let mailOptions = {from, to, subject, text, html};
  return Q.ninvoke(transporter, 'sendMail', mailOptions);
}

