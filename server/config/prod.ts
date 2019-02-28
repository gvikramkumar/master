
export default {
  port: 3002,
  corsOrigin: [],
  showStack: false,
  artUrl: 'https://wsgi-stage.cisco.com/cepm/pdpservices/authorizationmanagerservice',
  autoSyncOn: true,
  ssoUrl: 'https://localhost:3443',
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

