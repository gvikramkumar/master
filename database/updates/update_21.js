
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
db.auth(username, password);

db.getCollection('dfa_job_log').drop();
db.createCollection('dfa_job_log', {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});
db.dfa_job_log.createIndex({startDate: -1}, {expireAfterSeconds: 365 * 24 * 60 * 60});
db.createCollection('dfa_job', {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});
db.createCollection('dfa_server', {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});

db.dfa_job.insertMany([
  {
    name: 'primary-determination',
    period: 60 * 1000,
    startTime: '',
    runOnStartup: true, // needs to run before start-primary-jobs to initialize from last settings
    primary: false,
  },
  {
    name: 'start-primary-jobs',
    period: 5 * 1000,
    runOnStartup: false, // need to let primary determination run once at startup to clear things out
    primary: false,
  },
  {
    name: 'check-start-time-jobs',
    period: 60 * 1000,
    runOnStartup: false,
    primary: false,
  },
  {
    name: 'database-sync',
    period: 15 * 60 * 1000,
    runOnStartup: false,
    primary: true,
  },
  {
    name: 'approval-email-reminder',
    period: 5 * 60 * 1000,
    runOnStartup: false,
    primary: true,
  },
  {
    name: 'cache-refresh',
    startTime: '6am',
    runOnStartup: true,
    primary: false,
  },
]);

