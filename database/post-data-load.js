const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

const collections = [
  'allocation_rule',
  'module',
  'submeasure',
  'submeasure_rule'
];

const collectionsWithCreatedUpdated = [
  'allocation_rule',
  'submeasure_rule'
];

// add timestamps
const timestamp = Date.now();
collections.forEach(coll => {
  db.getCollection(coll).updateMany({}, {$set: {timestamp: NumberInt(timestamp)}});
});
const isoDate = new Date().toISOString();
collectionsWithCreatedUpdated.forEach(coll => {
  db.getCollection(coll).updateMany({}, {$set: {
      createdBy: '',
      createdDate: isoDate,
      updatedBy: '',
      updatedDate: isoDate
  }});
});

print('post-data-load complete');

