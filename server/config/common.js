module.exports = {
  port: 3000,
  mongoUri: null,
  postgres: {
    host: 'finpg-dev-01',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'finit1',
    schema: 'fdscon'
  },
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
