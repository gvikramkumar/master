export default {
  port: 3002,
  mongoUri: 'mongodb://localhost/fin-dfa',
  corsOrigin: ['http://localhost:4200'],
  showStack: true,
/*
  postgres: {
    host: 'finpg-dev-01',
    port: 5432,
    database: 'fpadev',
  }
*/
  postgres: {
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  }
};

