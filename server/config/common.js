module.exports = {
  port: 3000,
  mongoUri: null,
  postgresUri: null,
  corsOrigin: [],
  showStack: false,
  fileSizeMax: 10000000, // 10mb
  fileCountMax: 1 // limit file count and size for dos attacks

  /*
  ssl: {
    key: 'key.pem',
    cert: 'server.crt'
  }
*/
}
