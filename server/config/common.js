module.exports = {
  port: 3000,
  mongoUri: null,
  postgres: {
    host: 'finpg-dev-01',
    port: 5432,
    database: 'postgres',
    schema: 'fdscon'
  },
  corsOrigin: [],
  showStack: false,
  fileUpload: {
    fileSizeMax: 10000000, // 10mb
    fileCountMax: 1, // limit file count and size for dos attacks
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
}
