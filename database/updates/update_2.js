
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
print('update 2');

db.getCollection('dfa_allocation_rule').updateMany({driverName: 'MANUAL_MAP'}, {$set: {driverName: 'MANUALMAP'}});
