var conn;

print('host: ' + host + ', port: ' + port + ', db: ' + _db);

conn = new Mongo(host + ':' + port);
var db = conn.getDB(_db);


const caseInsensitiveCollections = [
  'allocation_rule',
  'module',
  'submeasure',
  'submeasure_rule'
];

caseInsensitiveCollections.forEach(coll => {
  db.getCollection(coll).drop();
  // this collation makes our indexes and find() calls case insensitive, search for john and get John as well
  db.createCollection(coll, {collation: {locale: 'en_US', strength: 2}});
});

const fileCollections = [
  'fs.chunks',
  'fs.files'
];
fileCollections.forEach(coll => {
  db.getCollection(coll).drop();
  db.createCollection(coll);
});

// add indexes;
// todo: add appropriate indexes on all collections
db.getCollection('fs.files').createIndex({'metadata.directory': 1});
db.getCollection('allocation_rule').createIndex({name: 1, updatedDate: -1});

print('create-collections complete');

