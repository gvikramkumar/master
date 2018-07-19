const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_submeasure.insertMany([
  {
    moduleId: NumberInt(1),
    name: "2 Tier Adjustment",
    desc: "2 Tier Adjustment",
    sourceId: NumberInt(1),
    measureId: NumberInt(1),
    startFiscalMonth: 201810,
    endFiscalMonth: 204012,
    processingTime: "Monthly",
    pnlnodeGrouping: "Indirect Adjustments",
    categoryType: "HW",
    inputFilterLevel: {
      salesLevel: "level1",
      scmsLevel: "SCMS",
      internalBELevel: "Internal BE",
      entityLevel: "BE"
    },
    manualMapping: {
      productLevel: "TG",
      salesLevel: "level2",
      scmsLevel: "SCMS",
      entityLevel: "BE"
    },
    reportingLevels: ["Indirect Revenue Adjustments"],
    indicators: {
      dollarUploadFlag: "Y",
      approveFlag: "Y",
      manualMapping: "Y",
      expenseSSOT: "Y",
      manualMix: "Y"
    },
    rules: ["GLREVMIX-PL3SL2-NOWWDIST-ROLL3", "MANUALMAP-PL3SL6-PERCENT"],
    status: "A",
  },
  {
    moduleId: NumberInt(1),
    name: "2 Tier Adjustment2",
    desc: "2 Tier Adjustment2",
    sourceId: NumberInt(2),
    measureId: NumberInt(2),
    startFiscalMonth: 201810,
    endFiscalMonth: 204012,
    processingTime: "Monthly",
    pnlnodeGrouping: "Indirect Adjustments",
    categoryType: "SW",
    inputFilterLevel: {
      productLevel: "TG",
      salesLevel: "level3",
      scmsLevel: "SCMS",
      entityLevel: "BE"
    },
    manualMapping: {
      salesLevel: "level4",
      scmsLevel: "SCMS",
      internalBELevel: "Internal BE",
      entityLevel: "BE"
    },
    reportingLevels: ["Manufacturing Overhead"],
    indicators: {
      dollarUploadFlag: "Y",
      approveFlag: "Y",
      manualMapping: "N",
      expenseSSOT: "Y",
      manualMix: "Y"
    },
    rules: ["REVPOS-NODISTI-NOSCMSOTHER-ROLL3", "SERVMAP-PL3BE-MTD"],
    status: "A",
  }
])

db.user_role.insertOne({
  userId: "jodoe",
  role: "Indirect Revenue Adjustments"
})

db.prof_dollar_upload.insertOne({
  fiscalMonth: 201809,
  submeasureName: "2 Tier Adjustment",
  product: "UCS",
  sales: "Americas",
  legalEntity: "Japan",
  intBusinessEntity: "collaboration",
  scms: "enterprise",
  dealId: "",
  grossUnbilledAccruedFlag: "N",
  revenueClassification: "Non Recurring",
  amount: 457.57
});

db.dfa_measure.insertMany([
  {
    measureId: NumberInt(1),
    moduleId: NumberInt(1),
    name: "Indirect Revenue Adjustments",
    abbrev: "revadj",
    sources: [1,2],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
    status: "A",
  },
  {
    measureId: NumberInt(2),
    moduleId: NumberInt(1),
    name: "Manufacturing Overhead",
    abbrev: "revadj",
    sources: [1,2],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
    status: "A"
  },
  {
    measureId: NumberInt(3),
    moduleId: NumberInt(1),
    name: "Manufacturing Supply Chain Expenses",
    abbrev: "revadj",
    sources: [1,2],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
    status: "A"
  },
  {
    measureId: NumberInt(4),
    moduleId: NumberInt(1),
    name: "Manufacturing V&O",
    abbrev: "revadj",
    sources: [1,2],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
    status: "A"
  },
  {
    measureId: NumberInt(5),
    moduleId: NumberInt(1),
    name: "Standard Cogs Adjustments",
    abbrev: "revadj",
    sources: [1,2],
    hierarchies: ['SALES'],
    approvalRequired: 'N',
    status: "A"
  },
  {
    measureId: NumberInt(6),
    moduleId: NumberInt(1),
    name: "Warranty",
    abbrev: "revadj",
    sources: [1,2],
    hierarchies: ['PRODUCT'],
    approvalRequired: 'N',
    status: "I"
  }
])

db.dfa_open_period.insertMany([
  {moduleId: NumberInt(1), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(2), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(3), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(4), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(5), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(6), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(7), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(8), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(9), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(10), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(11), fiscalMonth: 201809, openFlag: "Y"},
  {moduleId: NumberInt(12), fiscalMonth: 201809, openFlag: "Y"},
]);

db.prof_mapping_upload.insert({
  fiscalMonth: 201809,
  submeasureName: "2 Tier Adjustment",
  product: "UCS",
  sales: "Americas",
  legalEntity: "Japan",
  intBusinessEntity: "collaboration",
  scms: "enterprise",
  percentage: 458.58
})

db.lookup.insertMany([
  {
    key: 'revenue_classification',
    value: ["Recurring Deferred", "Recurring Non Deferred", "Recurring Other", "Non Recurring"]
  },
  {
    key: 'hierarchies',
    value: ['LEGAL ENTITY', 'PRODUCT', 'SALES']
  },
]);

// dept
db.prof_department_acc_map.insertOne({
  submeasureName: "2 Tier Adjustment",
  nodeValue: "020_070506",
  glAccount: "69999"
});

// sales-split
db.prof_sales_split_pct.insertOne({
  fiscalMonth: 201810,
  accountId: "42127",
  companyCode: "555",
  subaccountCode: "033",
  salesTerritoryCode: "AFRICA-PROG-REB-COMM",
  splitPercentage: 0.2
});

// product-class
db.prof_swalloc_manual_mix.insertOne({
  fiscalMonth: 201810,
  submeasureName: "2 Tier",
  splitCategory: "HARDWARE",
  splitPercentage: 1
});

db.dfa_source.insertMany([
  {
    sourceId: NumberInt(1),
    name: 'Manual Upload',
    desc: 'Manual Upload source',
    status: 'A'
  },
  {
    sourceId: NumberInt(2),
    name: 'Rapid Revenue',
    desc: 'Rapid Revenue source',
    status: 'A'
  },
])

const collectionsWithStatus = [
  'dfa_allocation_rule',
  'dfa_measure',
  'dfa_module',
  'dfa_source',
  'dfa_submeasure'
];

collectionsWithStatus.forEach(coll => {
  db.getCollection(coll).updateMany({}, {
    $set: {
      status: 'A'
    }
  });
});


// MAKE THIS BE LAST SO ALL TIMESTAMPED COLLECTIONS GET UPDATED
const collectionsWithCreatedUpdated = [
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

