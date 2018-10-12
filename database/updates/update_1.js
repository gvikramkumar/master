
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
load('database/updates/files/update_1_1.js');
db.dfa_lookup.insertOne({key: 'database-update-test', value: arr});

