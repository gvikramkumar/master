export default {
  port: 3002,
  ssl: false,
  corsOrigin: [],
  showStack: true,
  fileUpload: {
    fileSizeMax: 10000000, // 10mb
    fileCountMax: 1, // limit file count and size for dos attacks
  },
  artUrl: ' https://wsgi-stage.cisco.com/cepm/pdpservices/authorizationmanagerservice',
  mail: {
    host: 'mail.cisco.com',
    secure: false,
    port: 25
  },
  mongo: {
    uri: 'mongodb://localhost/fin-dfa',
    host: 'localhost',
    port: 27017,
    db: 'fin-dfa'
  },
  postgres: {
    host: 'finpg-dev-01',
    port: 5432,
    database: 'fpadev',
  }
  /*
  ssl: {
    key: 'key.pem',
    cert: 'server.crt'
  }
*/
};

