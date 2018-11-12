
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_measure.updateOne({name: 'Indirect Revenue Adjustments'}, {$set: {isCogsMeasure: 'N'}});

db.dfa_measure.updateMany({}, {$set: {approvalRequired: 'Y'}});
