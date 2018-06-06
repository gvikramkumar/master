var conn;

print('host: ' + host + ', port: ' + port + ', db: ' + _db);

conn = new Mongo(host + ':' + port);
var db = conn.getDB(_db);


const collections = [
  'allocation_rule',
  'module',
  'submeasure',
  'dollar_upload',
  'mapping_upload',
  'measure',
  'open_period',
  'user_role',
  'lookup',
  'sales_split_pct',
  'swalloc_manual_mix',
  'department_acc_map'
];

collections.forEach(coll => {
  db.getCollection(coll).drop();
  // this collation makes our indexes and find() calls case insensitive, search for john and get John as well
  db.createCollection(coll, {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});
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

db.dollar_upload.createIndex({submeasureName: 1, fiscalMonth: -1});
db.mapping_upload.createIndex({submeasureName: 1, fiscalMonth: -1});

// unique constraints
db.module.createIndex({name: 1}, {unique: true});
db.module.createIndex({seqnum: 1}, {unique: true});
db.submeasure.createIndex({name: 1}, {unique: true});
db.measure.createIndex({name: 1}, {unique: true});
db.lookup.createIndex({type: 1}, {unique: true});

print('>>>>>>>>>>>> create-collections complete');
// unique constraints

print('create-collections complete');

