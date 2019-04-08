export default {
  autoSyncOn: false,
  ssoUrl: 'https://localhost:8080',
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
