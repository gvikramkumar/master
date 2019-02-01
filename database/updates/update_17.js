
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
db.auth(username, password);

// add awaitingApproval flag to dept upload table
db.dfa_prof_dept_acct_map_upld.updateMany({}, {$set: {temp: 'N'}});
