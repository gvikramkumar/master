export default {
  port: 3001,
  corsOrigin: ['http://localhost:4201'],
  mongo: {
    uri: 'mongodb://localhost/fin-dfa',
    host: 'localhost',
    port: 27017,
    db: 'fin-dfa'
  },
  postgres: {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
  }
};

