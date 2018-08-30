const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_submeasure.insertMany([
  {
    submeasureId: NumberInt(1),
    moduleId: NumberInt(1),
    name: "2 Tier Adjustment",
    desc: "2 Tier Adjustment",
    sourceId: NumberInt(4),
    measureId: NumberInt(1),
    startFiscalMonth: NumberInt(201810),
    endFiscalMonth: NumberInt(204012),
    processingTime: "Monthly",
    pnlnodeGrouping: "Indirect Adjustments",
    categoryType: "HW",
    inputFilterLevel: {
      salesLevel: "level1",
      scmsLevel: "SCMS",
      internalBELevel: "Internal BE",
      entityLevel: "BE"
    },
    manualMapping: {},
    reportingLevels: [null, "Indirect Revenue Adjustments", null],
    indicators: {
      dollarUploadFlag: "Y",
      approveFlag: "Y",
      manualMapping: "Y",
      expenseSSOT: "Y",
      manualMix: "Y",
      groupFlag: 'N',
      retainedEarnings: 'N',
      transition: 'N',
      corpRevenue: 'Y',
      dualGaap: 'N',
      twoTier: 'N'
    },
    rules: ["GLREVMIX-PL3SL2-NOWWDIST-ROLL3", "MANUALMAP-PL3SL6-PERCENT"],
    status: "A",
  },
  {
    submeasureId: NumberInt(2),
    moduleId: NumberInt(1),
    name: "2 Tier Adjustment2",
    desc: "2 Tier Adjustment2",
    sourceId: NumberInt(4),
    measureId: NumberInt(2),
    startFiscalMonth: NumberInt(201810),
    endFiscalMonth: NumberInt(204012),
    processingTime: "Monthly",
    pnlnodeGrouping: "Indirect Adjustments",
    categoryType: "SW",
    inputFilterLevel: {
      productLevel: "TG",
      salesLevel: "level3",
      scmsLevel: "SCMS",
      entityLevel: "BE"
    },
    manualMapping: {},
    reportingLevels: ["Manufacturing Overhead"],
    indicators: {
      dollarUploadFlag: "Y",
      approveFlag: "Y",
      manualMapping: "Y",
      expenseSSOT: "Y",
      manualMix: "Y",
      groupFlag: 'Y',
      retainedEarnings: 'N',
      transition: 'N',
      corpRevenue: 'Y',
      dualGaap: 'N',
      twoTier: 'N'
    },
    rules: ["REVPOS-NODISTI-NOSCMSOTHER-ROLL3", "SERVMAP-PL3BE-MTD"],
    status: "A",
  }
])

db.user_role.insertOne({
  userId: "jodoe",
  role: "Indirect Revenue Adjustments"
})

db.dfa_prof_input_amnt_upld.insertOne({
  fiscalMonth: NumberInt(201809),
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
    typeCode: "REVADJ",
    sources: [NumberInt(1), NumberInt(2)],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
    status: "A",
    reportingLevel1: 'measure val',
    reportingLevel2: null,
    reportingLevel3: null,
    reportingLevel1Enabled: true,
    reportingLevel2Enabled: true,
    reportingLevel3Enabled: false,

  },
  {
    measureId: NumberInt(2),
    moduleId: NumberInt(1),
    name: "Standard COGS Adjustments",
    typeCode: "STDCOGSADJ",
    sources: [NumberInt(1), NumberInt(2)],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
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
    name: "Manufacturing Overhead",
    typeCode: "MOVHD",
    sources: [NumberInt(1), NumberInt(2)],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
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
    name: "Manufacturing Supply Chain Expenses",
    typeCode: "INVEX",
    sources: [NumberInt(1), NumberInt(2)],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
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
    name: "Warranty",
    typeCode: "WAREX",
    sources: [NumberInt(1), NumberInt(2)],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
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
    name: "Manufacturing V&O",
    typeCode: "MOCOGS",
    sources: [NumberInt(1), NumberInt(2)],
    hierarchies: ['PRODUCT', 'SALES'],
    approvalRequired: 'N',
    status: "A",
    reportingLevel1: null,
    reportingLevel2: null,
    reportingLevel3: null,
    reportingLevel1Enabled: true,
    reportingLevel2Enabled: true,
    reportingLevel3Enabled: true,

  }
])

db.dfa_open_period.insertMany([
  {moduleId: NumberInt(1), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(2), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(3), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(4), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(5), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(6), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(7), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(8), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(9), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(10), fiscalMonth: NumberInt(201809), openFlag: "Y"},
  {moduleId: NumberInt(11), fiscalMonth: NumberInt(201809), openFlag: "Y"},
]);

db.dfa_prof_manual_map_upld.insert({
  fiscalMonth: NumberInt(201809),
  submeasureName: "2 Tier Adjustment",
  product: "UCS",
  sales: "Americas",
  legalEntity: "Japan",
  intBusinessEntity: "collaboration",
  scms: "enterprise",
  percentage: 458.58
})

db.dfa_lookup.insertMany([
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
db.dfa_prof_dept_acct_map_upld.insertOne({
  submeasureName: "2 Tier Adjustment",
  nodeValue: "020_070506",
  glAccount: NumberInt(69999)
});

// sales-split
db.dfa_prof_sales_split_pctmap_upld.insertOne({
  fiscalMonth: NumberInt(201810),
  accountId: "42127",
  companyCode: "555",
  subaccountCode: "033",
  salesTerritoryCode: "AFRICA-PROG-REB-COMM",
  splitPercentage: 0.2
});

// product-class
db.dfa_prof_swalloc_manualmix_upld.insertOne({
  fiscalMonth: (201810),
  submeasureName: "2 Tier",
  splitCategory: "HARDWARE",
  splitPercentage: 1
});

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
  'dfa_module',
  'dfa_submeasure'
];

collectionsWithStatus.forEach(coll => {
  db.getCollection(coll).updateMany({}, {
    $set: {
      status: 'A'
    }
  });
});

const rules = [];
db.dfa_allocation_rule.find({}).forEach(rule => {
  if (rule.sl1Select && rule.sl1Select.trim().length) {
    const parse = parseSelect(rule.sl1Select);
    rule.salesCritCond = parse.cond;
    rule.salesCritChoices = parse.arr;
  }
  if (rule.scmsSelect && rule.scmsSelect.trim().length) {
    const parse = parseSelect(rule.scmsSelect);
    rule.scmsCritCond = parse.cond;
    rule.scmsCritChoices = parse.arr;
  }
  if (rule.beSelect && rule.beSelect.trim().length) {
    const parse = parseSelect(rule.beSelect);
    rule.beCritCond = parse.cond;
    rule.beCritChoices = parse.arr;
  }
  rules.push(rule);
});
db.dfa_allocation_rule.deleteMany({})
db.dfa_allocation_rule.insertMany(rules);

function parseSelect(str) {
  rtn = {};
  const idx = str.indexOf('(');
  rtn.cond = str.substr(0, idx).trim();
  rtn.arr = str.substr(idx).replace(/(\(|\)|'|")/g, '').trim().split(',');
  return rtn;
}

// MAKE THIS BE LAST SO ALL TIMESTAMPED COLLECTIONS GET UPDATED
const collectionsWithCreatedUpdated = [
  'dfa_allocation_rule',
  'dfa_data_source',
  'dfa_measure',
  'dfa_module',
  'dfa_module_data_source',
  'dfa_open_period',
  'dfa_submeasure',
  'dfa_prof_dept_acct_map_upld',
  'dfa_prof_input_amnt_upld',
  'dfa_prof_manual_map_upld',
  'dfa_prof_sales_split_pctmap_upld',
  'dfa_prof_swalloc_manualmix_upld',
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

