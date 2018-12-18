
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_measure.updateOne({name: 'Manufacturing Overhead'}, {$unset: {measureId: ''}})
db.dfa_measure.updateOne({name: 'Manufacturing Supply Chain Expenses'}, {$set: {measureId: NumberInt(3)}})
db.dfa_measure.updateOne({name: 'Manufacturing Overhead'}, {$set: {measureId: NumberInt(4)}})
