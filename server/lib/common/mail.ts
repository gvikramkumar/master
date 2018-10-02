import nodemailer from 'nodemailer';
import Q from 'q';
import _config from '../../config/get-config';
const config = _config.mail;

// keeps nodemailer from complaining about self signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const transporter = nodemailer.createTransport({
  host: config.host,
  secure: config.secure,
  port: config.port
});

export function sendTextMail(from, to, subject, body) {
  const mailOptions = {from, to, subject, text: body};
  return Q.ninvoke(transporter, 'sendMail', mailOptions);
}

export function sendHtmlMail(from, to, subject, body) {
  const mailOptions = {from, to, subject, html: body};
  return Q.ninvoke(transporter, 'sendMail', mailOptions);
}

