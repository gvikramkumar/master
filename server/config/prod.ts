export default {
  port: 3002,
  ssl: {
    key: 'key.pem',
    cert: 'server.crt'
  },
  corsOrigin: [],
  showStack: false,
  artUrl: 'xxx',
  mongo: {
    uri: 'mongodb://xxx/fin-dfa',
    host: 'xxx',
    port: 27017,
    db: 'fin-dfa'
  },
  postgres: {
    host: 'xxx',
    port: 5432,
    database: 'fpadev',
  }
};

