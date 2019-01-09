
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

// change categoryType MM to Manual Mix
db.dfa_submeasure.updateMany({categoryType: 'MM'}, {$set: {categoryType: 'Manual Mix'}});

