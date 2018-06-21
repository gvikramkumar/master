var conn;

print('host: ' + host + ', port: ' + port + ', db: ' + _db);

conn = new Mongo(host + ':' + port);
var db = conn.getDB(_db);


const collections = [
  'dfa_allocation_rule',
  'dfa_module',
  'dfa_submeasure',
  'prof_dollar_upload',
  'prof_mapping_upload',
  'dfa_measure',
  'dfa_open_period',
  'user_role',
  'lookup',
  'prof_sales_split_pct',
  'prof_swalloc_manual_mix',
  'prof_department_acc_map'
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
db.dfa_allocation_rule.createIndex({moduleId: 1, name: 1, updatedDate: -1});
db.submeasure.createIndex({moduleId: 1, name: 1});

db.prof_dollar_upload.createIndex({submeasureName: 1, fiscalMonth: -1});
db.prof_mapping_upload.createIndex({submeasureName: 1, fiscalMonth: -1});
db.prof_swalloc_manual_mix.createIndex({submeasureName: 1, fiscalMonth: -1});

// unique constraints
db.dfa_module.createIndex({name: 1}, {unique: true});
db.dfa_module.createIndex({id: 1}, {unique: true});
db.dfa_module.createIndex({displayOrder: 1}, {unique: true});
db.dfa_submeasure.createIndex({name: 1}, {unique: true});
db.dfa_measure.createIndex({name: 1}, {unique: true});
db.lookup.createIndex({type: 1}, {unique: true});

print('>>>>>>>>>>>> create-collections complete');
// unique constraints

print('create-collections complete');

