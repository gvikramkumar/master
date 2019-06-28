export default {
  ssoUrl: 'http://localhost:8080',
  multipleServers: false,
  mongo: {
    uri: 'mongodb://findp-dev-01.cisco.com/fin-dfa',
    host: 'findp-dev-01.cisco.com',
    port: 27017,
    db: 'fin-dfa'
    },
  postgres: {
    host: 'finpg-dev-01',
    port: 5432,
    database: 'fpadev',
  }
};
