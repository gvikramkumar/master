export default {
  port: 3002,
  ssl: {
    key: 'key.pem',
    cert: 'server.crt'
  },
  corsOrigin: [],
  showStack: false,
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
};

