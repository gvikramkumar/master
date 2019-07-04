export default {
  showStack: true,
  multipleServers: false,
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

/*
dev
  postgres: {
    host: 'finpg-dev-01',
    port: 5432,
    database: 'fpadev',
  }

stage
  postgres: {
    host: 'finpg-stg-01',
    port: 5432,
    database: 'fpastg',
  }
 */
