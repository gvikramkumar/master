
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_submeasure.updateMany({}, {$unset: {submittedBy: '', submittedDate: ''}});
