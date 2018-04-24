const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

const collections = [
  'allocation_rules',
  'modules',
  'submeasure_list',
  'submeasure_rule_map'
];

// add timestamps
const now = Date.now();
collections.forEach(coll => {
  db.getCollection(coll).updateMany({}, {$set: {timestamp: NumberInt(now)}});
});

print('post-data-load complete');

