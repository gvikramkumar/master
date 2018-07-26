var conn;

print('host: ' + host + ', port: ' + port + ', db: ' + _db);

conn = new Mongo(host + ':' + port);
var db = conn.getDB(_db);


const collections = [
  'lookup',
  'module_lookup',
  'user_role',
  'dfa_allocation_rule',
  'dfa_measure',
  'dfa_module',
  'dfa_open_period',
  'dfa_source',
  'dfa_submeasure',
  'prof_department_acc_map',
  'prof_dollar_upload',
  'prof_mapping_upload',
  'prof_sales_split_pct',
  'prof_swalloc_manual_mix',
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
// id columns
db.dfa_module.createIndex({moduleId: -1}, {unique: true});
db.dfa_measure.createIndex({measureId: 1}, {unique: true});
db.dfa_source.createIndex({sourceId: -1}, {unique: true});



db.getCollection('fs.files').createIndex({'metadata.directory': 1});
db.dfa_allocation_rule.createIndex({moduleId: 1, name: 1, updatedDate: -1});
db.dfa_submeasure.createIndex({moduleId:1, name: 1}, {unique: true});
db.dfa_measure.createIndex({moduleId:1, name: 1}, {unique: true});

db.prof_dollar_upload.createIndex({submeasureName: 1, fiscalMonth: -1});
db.prof_mapping_upload.createIndex({submeasureName: 1, fiscalMonth: -1});
db.prof_swalloc_manual_mix.createIndex({submeasureName: 1, fiscalMonth: -1});

db.dfa_module.createIndex({name: 1}, {unique: true});
db.dfa_module.createIndex({displayOrder: 1}, {unique: true});
db.dfa_source.createIndex({name: 1}, {unique: true});

db.lookup.createIndex({key: 1}, {unique: true});// shared
db.module_lookup.createIndex({moduleId: 1, key: 1}, {unique: true});// per module



print('>>>>>>>>>>>> create-collections complete');
// unique constraints

print('create-collections complete');

