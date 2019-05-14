import nodemailer from 'nodemailer';
import Q from 'q';
import _config from '../../config/get-config';
import AnyObj from '../../../shared/models/any-obj';
const config = _config.mail;

// keeps nodemailer from complaining about self signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const transporter = nodemailer.createTransport({
  host: config.host,
  secure: config.secure,
  port: config.port
});

export const mail = {
  sendTextMail,
  sendHtmlMail
}


function sendTextMail(from, to, cc, subject, body) {
  const mailOptions: AnyObj = {from, to, subject, text: body};
  if (cc) {
    mailOptions.cc = cc;
  }
  return Q.ninvoke(transporter, 'sendMail', mailOptions)
    .catch(err => {
      err.mailOptions = mailOptions;
      throw(err);
    });
}

function sendHtmlMail(from, to, cc, subject, body) {
  const mailOptions: AnyObj = {from, to, subject, html: body};
  if (cc) {
    mailOptions.cc = cc;
  }
  return Q.ninvoke(transporter, 'sendMail', mailOptions)
    .catch(err => {
      err.mailOptions = mailOptions;
      throw(err);
    });
}

