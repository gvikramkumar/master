
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
db.auth(username, password);

// recreate dfa_job_log and index for case-insensitive
db.getCollection('dfa_job_log').drop();
db.createCollection('dfa_job_log', {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});
db.dfa_job_log.createIndex({startDate: -1}, {expireAfterSeconds: 365 * 24 * 60 * 60});

// new collections
db.createCollection('dfa_job_config', {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});
db.createCollection('dfa_job_run', {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});
db.createCollection('dfa_server', {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});

// new indexes
db.dfa_job_config.createIndex({name: 1}, {unique: true});
db.dfa_job_run.createIndex({name: 1, serverUrl: 1}, {unique: true});
db.dfa_server.createIndex({url: 1}, {unique: true});

db.dfa_job_config.insertMany([
  {
    name: 'primary-determination',
    period: 5 * 1000,
    runOnStartup: true, // needs to run before start-primary-jobs to initialize from last settings
    log: false,
    active: true,
    primary: false,
  },
  {
    name: 'start-primary-jobs',
    period: 5 * 1000,
    runOnStartup: false, // need to let primary determination run once at startup to clear things out, so we'll not run on startup for this one
    log: false,
    active: true,
    primary: false,
  },
  {
    name: 'check-start-time-jobs',
    period: 5 * 1000,
    runOnStartup: false,
    log: false,
    active: true,
    primary: false,
  },
  {
    name: 'database-sync',
    period: 15 * 60 * 1000,
    runOnStartup: false,
    log: true,
    active: true,
    primary: true,
  },
  {
    name: 'approval-email-reminder',
    period: 5 * 60 * 1000,
    runOnStartup: false,
    log: true,
    active: true,
    primary: true,
  },
  {
    name: 'cache-refresh',
    startTime: '6am',
    runOnStartup: true,
    log: true,
    active: true,
    primary: false,
  },
]);

