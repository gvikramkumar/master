
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
db.auth(username, password);

db.dfa_lookup.updateOne({key:'itadmin-email'}, {$set: {value: 'dfa-it-admin@cisco.com'}});
db.dfa_lookup.insertMany([
  {key: 'dfa-admin-email', value: 'dfa-admin@cisco.com'},
  {key: 'dfa-biz-admin-email', value: 'dfa_business_admin@cisco.com'},
]);

