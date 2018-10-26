
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

// add genric users
db.dfa_lookup.replaceOne({key: 'generic-users'}, {key: 'generic-users', value: ['dfaadmin.gen', 'dakahle', 'rsamband', 'amalakar']});
