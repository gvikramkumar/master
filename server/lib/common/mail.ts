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

export default {
  send
};

function send(from, to, subject, text, html) {
  const mailOptions = {from, to, subject, text, html};
  return Q.ninvoke(transporter, 'sendMail', mailOptions);
}

