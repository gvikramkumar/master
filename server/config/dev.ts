export default {
  corsOrigin: ['http://localhost:4200'],
  showStack: true,
  autoSyncOn: false,
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
