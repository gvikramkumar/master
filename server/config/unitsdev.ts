export default {
  port: 3001,
  corsOrigin: ['http://localhost:4201'],
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

