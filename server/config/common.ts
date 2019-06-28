export default {
  port: 3002,
  ssl: false,
  corsOrigin: ['http://localhost:4200', 'http://localhost:4201'],
  showStack: true,
  serverTimeout: 5 * 60 * 1000, // same time as express timeout which subtracts 5 sec
  expressTimeout: (5 * 60 * 1000) - 5000, // 5 sec before server times out, put up a friendly message
  submitForApprovalReminderInterval: 5 * (60 * 1000),
  submitForApprovalReminderPeriod: 1 * (24 * 60 * 60 * 1000),
  multipleServers: false,
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

