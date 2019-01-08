const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_measure.insertMany([
  {
    measureId: NumberInt(1),
    moduleId: NumberInt(1),
    name: "Indirect Revenue Adjustments",
    typeCode: "REVADJ",
    sources: [NumberInt(1), NumberInt(2),NumberInt(3), NumberInt(4)],
    hierarchies: ['PRODUCT', 'SALES'],
    status: "A",
    reportingLevel1: 'indirect1',
    reportingLevel2: 'indirect2',
    reportingLevel3: null,
    reportingLevel1Enabled: false,
    reportingLevel2Enabled: false,
    reportingLevel3Enabled: false,
    reportingLevel3SetToSubmeasureName: true
  },
  {
    measureId: NumberInt(2),
    moduleId: NumberInt(1),
    name: "Standard COGS Adjustments",
    typeCode: "STDCOGSADJ",
    sources: [NumberInt(1), NumberInt(2),NumberInt(3), NumberInt(4)],
    hierarchies: ['PRODUCT', 'SALES'],
    status: "A",
    reportingLevel1: null,
    reportingLevel2: null,
    reportingLevel3: null,
    reportingLevel1Enabled: true,
    reportingLevel2Enabled: true,
    reportingLevel3Enabled: true,

  },
  {
    measureId: NumberInt(3),
    moduleId: NumberInt(1),
    name: "Manufacturing V&O",
    typeCode: "MOCOGS",
    sources: [NumberInt(1), NumberInt(2),NumberInt(3), NumberInt(4)],
    hierarchies: ['PRODUCT', 'SALES'],
    status: "A",
    reportingLevel1: null,
    reportingLevel2: null,
    reportingLevel3: null,
    reportingLevel1Enabled: true,
    reportingLevel2Enabled: true,
    reportingLevel3Enabled: true,

  },
  {
    measureId: NumberInt(4),
    moduleId: NumberInt(1),
    name: "Manufacturing Overhead",
    typeCode: "MOVHD",
    sources: [NumberInt(1), NumberInt(2),NumberInt(3), NumberInt(4)],
    hierarchies: ['PRODUCT', 'SALES'],
    status: "A",
    reportingLevel1: null,
    reportingLevel2: null,
    reportingLevel3: null,
    reportingLevel1Enabled: true,
    reportingLevel2Enabled: true,
    reportingLevel3Enabled: true,

  },
  {
    measureId: NumberInt(5),
    moduleId: NumberInt(1),
    name: "Manufacturing Supply Chain Expenses",
    typeCode: "INVEX",
    sources: [NumberInt(1), NumberInt(2),NumberInt(3), NumberInt(4)],
    hierarchies: ['PRODUCT', 'SALES'],
    status: "A",
    reportingLevel1: null,
    reportingLevel2: null,
    reportingLevel3: null,
    reportingLevel1Enabled: true,
    reportingLevel2Enabled: true,
    reportingLevel3Enabled: true,

  },
  {
    measureId: NumberInt(6),
    moduleId: NumberInt(1),
    name: "Warranty",
    typeCode: "WAREX",
    sources: [NumberInt(1), NumberInt(2),NumberInt(3), NumberInt(4)],
    hierarchies: ['PRODUCT', 'SALES'],
    status: "A",
    reportingLevel1: null,
    reportingLevel2: null,
    reportingLevel3: null,
    reportingLevel1Enabled: true,
    reportingLevel2Enabled: true,
    reportingLevel3Enabled: true,

  },
])

db.dfa_open_period.insertMany([
  {moduleId: NumberInt(1), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(2), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(3), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(4), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(5), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(6), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(7), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(8), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(9), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(10), fiscalMonth: NumberInt(201904), openFlag: "Y"},
  {moduleId: NumberInt(11), fiscalMonth: NumberInt(201904), openFlag: "Y"},
]);

db.dfa_lookup.insertMany([
  {
    key: 'build-number',
    value: "0"
  },
  {
    key: 'itadmin-email',
    value: 'dfa-admin@cisco.com'
  },
  {
    key: 'database-version',
    value: 0
  },
  {
    key: 'revenue_classification',
    value: ["Recurring Deferred", "Recurring Non Deferred", "Recurring Other", "Non Recurring"]
  },
  {
    key: 'hierarchies',
    value: ['LEGAL ENTITY', 'PRODUCT', 'SALES']
  },
  {
    key: 'site-allowed-users',
    value: ['jodoe', 'dakahle', 'rsamband', 'moltman', 'vgurumoo', 'prmaiya', 'ramgarg', 'mcai', 'amalakar',
      'akmehrot', 'kalaissu', 'heyeung', 'myjagade', // bizadmin only
    ]
  },
]);

db.dfa_module_data_source.insertMany([
  {moduleId: NumberInt(1), sources: [NumberInt(1),NumberInt(2), NumberInt(3),NumberInt(4)]}
])

db.dfa_data_source.insertMany([
  {
    sourceId: NumberInt(1),
    name: 'Rapid Revenue',
    desc: 'Rapid Revenue source',
    typeCode: 'RRR',
    status: 'A'
  },
  {
    sourceId: NumberInt(2),
    name: 'MRAP',
    desc: 'MRAP source',
    typeCode: 'MRAP',
    status: 'A'
  },
  {
    sourceId: NumberInt(3),
    name: 'Expense SSOT',
    desc: 'Expense SSOT source',
    typeCode: 'EXPMFGO',
    status: 'A'
  },
  {
    sourceId: NumberInt(4),
    name: 'Manual Upload',
    desc: 'Manual Upload source',
    typeCode: 'EXCEL',
    status: 'A'
  },
])

const collectionsWithStatus = [
  'dfa_allocation_rule',
  'dfa_measure',
  'dfa_module'
];

collectionsWithStatus.forEach(coll => {
  db.getCollection(coll).updateMany({}, {
    $set: {
      status: 'A'
    }
  });
});

db.dfa_allocation_rule.updateMany({}, {$set: {approvedOnce: 'Y', activeStatus: 'A'}});

db.dfa_allocation_rule.updateMany({salesMatch: ''}, {$unset: {salesMatch: ''}});
db.dfa_allocation_rule.updateMany({productMatch: ''}, {$unset: {productMatch: ''}});
db.dfa_allocation_rule.updateMany({scmsMatch: ''}, {$unset: {scmsMatch: ''}});
db.dfa_allocation_rule.updateMany({legalEntityMatch: ''}, {$unset: {legalEntityMatch: ''}});
db.dfa_allocation_rule.updateMany({beMatch: ''}, {$unset: {beMatch: ''}});
db.dfa_allocation_rule.updateMany({sl1Select: ''}, {$unset: {sl1Select: ''}});
db.dfa_allocation_rule.updateMany({scmsSelect: ''}, {$unset: {scmsSelect: ''}});
db.dfa_allocation_rule.updateMany({beSelect: ''}, {$unset: {beSelect: ''}});


// MAKE THIS BE LAST SO ALL TIMESTAMPED COLLECTIONS GET UPDATED
const collectionsWithCreatedUpdated = [
  'dfa_allocation_rule',
  'dfa_data_source',
  'dfa_measure',
  'dfa_module',
  'dfa_module_data_source',
  'dfa_open_period',
];

const date = new Date();
collectionsWithCreatedUpdated.forEach(coll => {
  db.getCollection(coll).updateMany({}, {
    $set: {
      createdBy: 'system',
      createdDate: date,
      updatedBy: 'system',
      updatedDate: date
    }
  });
});

print('>>>>>>>>>> post-data-load complete');

