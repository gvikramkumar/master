
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_measure.updateOne({name: 'Manufacturing V&O'}, {$unset: {measureId: ''}})
db.dfa_measure.updateOne({name: 'Warranty'}, {$set: {measureId: NumberInt(6)}})
db.dfa_measure.updateOne({name: 'Manufacturing V&O'}, {$set: {measureId: NumberInt(5)}})
