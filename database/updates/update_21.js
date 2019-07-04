
print(`host: ${host}, port: ${port}, db: ${_db}, username: ${username}`);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

if (username && password && username !== 'undefined' && password !== 'undefined') {
  db.auth(username, password);
}

// recreate dfa_job_log and index for case-insensitive
db.getCollection('dfa_job_log').drop();
db.createCollection('dfa_job_log', {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});
db.dfa_job_log.createIndex({jobName: 1, timestamp: -1});
db.dfa_job_log.createIndex({startDate: -1}, {expireAfterSeconds: 6 * 30 * 24 * 60 * 60}); // 6 months

db.dfa_lookup.insertOne({key: 'runningJobs', value: {}});
