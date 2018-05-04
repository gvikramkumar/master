var conn;

print('host: ' + host + ', port: ' + port + ', db: ' + _db);

conn = new Mongo(host + ':' + port);
var db = conn.getDB(_db);


const collections = [
  'fs.chuncks',
  'fs.files',
  'allocation_rule',
  'module',
  'submeasure',
  'submeasure_rule'
];

// drop/create collections
collections.forEach(coll => {
  db.getCollection(coll).drop();
  db.createCollection(coll);
});

// add indexes
// todo: add appropriate indexes on all collections
db.getCollection('fs.files').createIndex('metadata.directory');


print('create-collections complete');

