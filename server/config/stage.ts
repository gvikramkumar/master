
export default {
  port: 3002,
  showStack: false,
  ssoUrl: 'https://localhost:3443',
  checkServerFlags: true,
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

/*
  ssl: {
    key: '../../../../DFA/ssl_cert/dfaSSL.key',
    cert: '../../../../DFA/ssl_cert/dfaSSL.csr'
  },
 */

