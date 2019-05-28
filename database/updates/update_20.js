
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
db.auth(username, password);

db.dfa_open_period.createIndex({moduleId: 1}, {unique: true});
db.dfa_job_log.createIndex({startDate: -1}, {expireAfterSeconds: 365 * 24 * 60 * 60});
