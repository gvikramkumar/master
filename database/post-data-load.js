const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

const collectionsWithCreatedUpdated = [
  'allocation_rule',
  'submeasure',
  'submeasure_rule',
  'dollar_upload'
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

