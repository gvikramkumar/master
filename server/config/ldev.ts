export default {
  multipleServers: true,
  mongo: {
    uri: 'mongodb://localhost/fin-dfa',
    host: 'localhost',
    port: 27017,
    db: 'fin-dfa'
  },
  postgres: {
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  }
};

