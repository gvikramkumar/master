
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

print('update 10');
db.dfa_lookup.updateOne({key: 'test'}, {$set: {value: val2}});
