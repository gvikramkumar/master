export default {
  port: 3002,
  ssl: {
    key: 'key.pem',
    cert: 'server.crt'
  },
  corsOrigin: [],
  showStack: false,
  artUrl: 'https://wsgi-stage.cisco.com/cepm/pdpservices/authorizationmanagerservice',
  mongo: {
    uri: 'mongodb://findp-stg-01.cisco.com/fin-dfa',
    host: 'findp-stg-01.cisco.com',
    port: 27017,
    db: 'fin-dfa'
  },
  postgres: {
    host: 'finpg-stg-01',
    port: 5432,
    database: 'fpastg',
  }
};

