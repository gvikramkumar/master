const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

const collections = [
  'allocation_rules',
  'modules',
  'submeasure_list',
  'submeasure_rule_map'
];

const collectionsWithCreatedUpdated = [
  'allocation_rules',
  'submeasure_rule_map'
];

// add timestamps
const timestamp = Date.now();
collections.forEach(coll => {
  db.getCollection(coll).updateMany({}, {$set: {timestamp: NumberInt(timestamp)}});
});
// const isoDate = new Date().toISOString();
collectionsWithCreatedUpdated.forEach(coll => {
  db.getCollection(coll).updateMany({}, {$set: {
      createdBy: '',
      createdDate: '',
      updatedBy: '',
      updatedDate: ''
  }});
});

print('post-data-load complete');

