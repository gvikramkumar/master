
// print(`host: ${host}, port: ${port}, db: ${_db}, user: ${user}`);
print(`host: ${host}, port: ${port}, db: ${_db}`);

let uri;
uri = `mongodb://${user}:${pass}@${host}:${port}/${_db}`;
// uri = `mongodb://${host}:${port}/${_db}`;
print(uri);

db = connect(uri);

/*
rollover tables
•	fpadfa.dfa_prof_disti_to_direct_map_upld
•	fpadfa.dfa_prof_manual_map_upld
•	fpadfa.dfa_prof_sales_split_pctmap_upld
•	fpadfa.dfa_prof_scms_triang_altsl2_map_upld
•	fpadfa.dfa_prof_scms_triang_corpadj_map_upld
•	fpadfa.dfa_prof_swalloc_manualmix_upld
 */

// this is a case INsensitive database because of this collation setting we do. All collections
// have to be added to this and go through this collation setting, either here or in an update.
const collationCollections = [
  'dfa_allocation_rule',
  'dfa_data_source',
  'dfa_lookup',
  'dfa_measure',
  'dfa_module',
  'dfa_module_data_source',
  'dfa_module_lookup',
  'dfa_open_period',
  'dfa_prof_dept_acct_map_upld',
  'dfa_prof_disti_to_direct_map_upld',
  'dfa_prof_input_amnt_upld',
  'dfa_prof_manual_map_upld',
  'dfa_prof_sales_split_pctmap_upld',
  'dfa_prof_swalloc_manualmix_upld',
  'dfa_prof_scms_triang_altsl2_map_upld',
  'dfa_prof_scms_triang_corpadj_map_upld',
  'dfa_prof_service_map_upld',
  'dfa_prof_service_trngsplit_pctmap_upld',
  'dfa_submeasure',
  'dfa_user'
];

collationCollections.forEach(coll => {
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
db.dfa_data_source.createIndex({sourceId: -1}, {unique: true});

db.getCollection('fs.files').createIndex({'metadata.directory': 1});
db.dfa_allocation_rule.createIndex({name: 1, updatedDate: -1});
db.dfa_submeasure.createIndex({name: 1, updatedDate: -1});
db.dfa_measure.createIndex({name: 1}, {unique: true});

db.dfa_prof_input_amnt_upld.createIndex({submeasureName: 1, fiscalMonth: -1});
db.dfa_prof_manual_map_upld.createIndex({submeasureName: 1, fiscalMonth: -1});
db.dfa_prof_swalloc_manualmix_upld.createIndex({submeasureName: 1, fiscalMonth: -1});

db.dfa_module.createIndex({name: 1}, {unique: true});
db.dfa_module.createIndex({abbrev: 1}, {unique: true});
db.dfa_module.createIndex({displayOrder: 1}, {unique: true});
db.dfa_data_source.createIndex({name: 1}, {unique: true});
db.dfa_data_source.createIndex({typeCode: 1}, {unique: true});
db.dfa_module_data_source.createIndex({moduleId: 1}, {unique: true});

db.dfa_lookup.createIndex({key: 1}, {unique: true});// shared
db.dfa_module_lookup.createIndex({moduleId: 1, key: 1}, {unique: true});// per module

print('>>>>>>>>>>>> create-collections complete');
// unique constraints

print('create-collections complete');

