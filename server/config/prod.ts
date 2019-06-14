
export default {
  port: 3002,
  corsOrigin: [],
  showStack: false,
  ssoUrl: 'https://localhost:3443',
  art: {
    url: 'https://wsgi.cisco.com/cepm/pdpservices/authorizationmanagerservice',
  },
  mongo: {
    uri: 'mongodb://findp-rcdn-prd-01:27017,findp-rcdn-prd-02:27017,findp-rcdn-prd-03:27017,findp-alln-prd-01:27017,findp-alln-prd-02:27017/fin-dfa?replicaSet=rsrcdn',
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

