
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
db.auth(username, password);

// toss the manualMix and expenseSSOT flags
db.dfa_submeasure.updateMany({}, {$unset: {'indicators.manualMix': ''}});
db.dfa_submeasure.updateMany({}, {$unset: {'indicators.expenseSSOT': ''}});

// change categoryType MM to Manual Mix
db.dfa_submeasure.updateMany({categoryType: 'MM'}, {$set: {categoryType: 'Manual Mix'}});

