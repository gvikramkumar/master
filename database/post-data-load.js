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

const date = new Date();
collectionsWithCreatedUpdated.forEach(coll => {
  db.getCollection(coll).updateMany({}, {$set: {
      createdBy: '',
      createdDate: date,
      updatedBy: '',
      updatedDate: date
  }});
});

print('post-data-load complete');

