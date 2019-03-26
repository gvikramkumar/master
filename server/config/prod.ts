
export default {
  port: 3002,
  corsOrigin: [],
  showStack: false,
  artUrl: 'https://wsgi-stage.cisco.com/cepm/pdpservices/authorizationmanagerservice',
  autoSyncOn: true,
  ssoUrl: 'https://localhost:3443',
  mongo: {
    uri: 'mongodb://findp-rcdn-prd-01/fin-dfa',
    host: 'findp-rcdn-prd-01.cisco.com',
    port: 27017,
    db: 'fin-dfa'
  },
  postgres: {
    host: 'finpg-rcdn-prd-01',
    port: 5432,
    database: 'fpaprd',
  }
};

