
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

// just need the 2 new ones, but had this with all with no collation, so rerun all with collation to keep case insensitive.
const collationCollections = [
  'dfa_prof_scms_triang_altsl2_map_upld',
  'dfa_prof_scms_triang_corpadj_map_upld',
  'dfa_prof_disti_to_direct_map_upld'
];

collationCollections.forEach(coll => {
  db.getCollection(coll).drop();
  // this collation makes our indexes and find() calls case insensitive, search for john and get John as well
  db.createCollection(coll, {collation: {locale: 'en_US', strength: 1, numericOrdering: true}});
});

drivers = [
  {name: 'Software POS Revenue', value: 'POSREVSW'},
  {name: 'Manual Map', value: 'MANUALMAP'},
  {name: 'Shipped Revenue', value: 'SHIPREV'},
  {name: 'POS Revenue', value: 'REVPOS'},
  {name: 'CE GL Revenue', value: 'GLREV_CE'},
  {name: 'Gross Revenue CMDM', value: 'GLREV'},
  {name: 'GL Revenue AS Subscription', value: 'GLREVASSUB'},
  {name: '2T Subscription Revenue', value: '2TSUBDIR'},
  {name: 'Net Revenue', value: 'GLREVMIX'},
  {name: 'Shipment', value: 'SHIPMENT'},
  {name: 'Remarketing Revenue', value: 'REMKTREV'},
  {name: 'VIP Rebate', value: 'VIP'},
  {name: 'VIP Rebate Service', value: 'VIP_SVC'},
  {name: 'Service Map', value: 'SERVMAP'},
  {name: 'Service Revenue', value: 'SVCREVT3'}
];

periods = [
  {period: 'MTD'},
  {period: 'QTD'},
  {period: 'ROLL3'},
  {period: 'ROLL6'},
  {period: 'PRIOR ROLL3'},
  {period: 'PRIOR ROLL6'},
];

db.dfa_lookup.insertMany([
  {key: 'drivers', value: drivers},
  {key: 'periods', value: periods},
])
