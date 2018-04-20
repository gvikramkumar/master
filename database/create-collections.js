var conn;

print('mongoUri: ' + mongoUri + ', mongoDatabase: ' + mongoDatabase);

conn = new Mongo(mongoUri);
var db = conn.getDB(mongoDatabase);


const collections = [
  'dfa_allocation_rules',
  'dfa_modules',
  'dfa_submeasure_list',
  'dfa_submeasure_rule_map'
];

// drop/create collections
collections.forEach(coll => {
  db.getCollection(coll).drop();
  db.createCollection(coll);
});

// add indexes
// todo: add appropriate indexes on all collections

print('create-collections complete');

