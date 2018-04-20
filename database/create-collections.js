var conn;

print('host: ' + host + ', port: ' + port + ', db: ' + _db);

conn = new Mongo(host + ':' + port);
var db = conn.getDB(_db);


const collections = [
  'allocation_rules',
  'modules',
  'submeasure_list',
  'submeasure_rule_map'
];

// drop/create collections
collections.forEach(coll => {
  db.getCollection(coll).drop();
  db.createCollection(coll);
});

// add indexes
// todo: add appropriate indexes on all collections

print('create-collections complete');

