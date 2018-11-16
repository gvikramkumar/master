
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

const uploads = [
  'dfa_prof_dept_acct_map_upld',
  'dfa_prof_input_amnt_upld',
  'dfa_prof_manual_map_upld',
  'dfa_prof_sales_split_pctmap_upld',
  'dfa_prof_swalloc_manualmix_upld',
  'dfa_prof_scms_triang_altsl2_map_upld',
  'dfa_prof_scms_triang_corpadj_map_upld'
]

uploads.forEach(coll => {
  db.getCollection(coll).drop();
  db.createCollection(coll);
});

