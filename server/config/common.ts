export default {
  port: 3002,
  ssl: false,
  corsOrigin: ['http://localhost:4200', 'http://localhost:4201'],
  showStack: true,
  expressTimeout: 1000 * (55 + 60),
  submitForApprovalReminderInterval: 5 * (60 * 1000),
  submitForApprovalReminderPeriod: 1 * (24 * 60 * 60 * 1000),
  fileUpload: {
    fileSizeMax: 10000000, // 10mb
    fileCountMax: 1, // limit file count and size for dos attacks
  },
  art: {
    url: 'https://wsgi-stage.cisco.com/cepm/pdpservices/authorizationmanagerservice',
    timeout: 5 * 60 * 1000 // 5 min
  },
  mail: {
    host: 'mail.cisco.com',
    secure: false,
    port: 25
  }
  /*
  ssl: {
    key: 'key.pem',
    cert: 'server.crt'
  }
*/
};

