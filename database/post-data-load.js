const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_submeasure.insertMany([
  {
    moduleId: NumberInt(1),
    name: "2 Tier Adjustment",
    description: "2 Tier Adjustment",
    source: "manual",
    measureName: "Indirect Revenue Adjustments",
    startFiscalMonth: 201810,
    endFiscalMonth: 204012,
    processingTime: "Monthly",
    pnlnodeGrouping: "Indirect Adjustments",
    categoryType: "HW",
    inputFilterLevel: {
      productLevel: "PF",
      salesLevel: "level1",
      scmsLevel: "SCMS",
      internalBELevel: "Internal BE",
      entityLevel: "BE"
    },
    manualMapping: {
      productLevel: "TG",
      salesLevel: "level2",
      scmsLevel: "SCMS",
      internalBELevel: "Internal SUB BE",
      entityLevel: "BE"
    },
    reportingLevels: ["Indirect Revenue Adjustments"],
    indicators: {
      dollarUploadFlag: "Y",
      approveFlag: "Y",
      status: "A",
      manualMapping: "Y",
      expenseSSOT: "Y",
      manualMix: "Y"
    },
    rules: ["GLREVMIX-PL3SL2-NOWWDIST-ROLL3", "MANUALMAP-PL3SL6-PERCENT"]
  },
  {
    moduleId: NumberInt(1),
    name: "2 Tier Adjustment2",
    description: "2 Tier Adjustment2",
    source: "manual",
    measureName: "Manufacturing Overhead",
    startFiscalMonth: 201810,
    endFiscalMonth: 204012,
    processingTime: "Monthly",
    pnlnodeGrouping: "Indirect Adjustments",
    categoryType: "SW",
    inputFilterLevel: {
      productLevel: "TG",
      salesLevel: "level3",
      scmsLevel: "SCMS",
      internalBELevel: "Internal SUB BE",
      entityLevel: "BE"
    },
    manualMapping: {
      productLevel: "PF",
      salesLevel: "level4",
      scmsLevel: "SCMS",
      internalBELevel: "Internal BE",
      entityLevel: "BE"
    },
    reportingLevels: ["Manufacturing Overhead"],
    indicators: {
      dollarUploadFlag: "Y",
      approveFlag: "Y",
      status: "A",
      manualMapping: "Y",
      expenseSSOT: "Y",
      manualMix: "Y"
    },
    rules: ["REVPOS-NODISTI-NOSCMSOTHER-ROLL3", "SERVMAP-PL3BE-MTD"]
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
    moduleId: NumberInt(1),
    name: "Indirect Revenue Adjustments",
    typeCode: "revadj",
    statusFlag: "Y"
  },
  {
    moduleId: NumberInt(1),
    name: "Manufacturing Overhead",
    typeCode: "revadj",
    statusFlag: "Y"
  },
  {
    moduleId: NumberInt(1),
    name: "Manufacturing Supply Chain Expenses",
    typeCode: "revadj",
    statusFlag: "Y"
  },
  {
    moduleId: NumberInt(1),
    name: "Manufacturing V&O",
    typeCode: "revadj",
    statusFlag: "Y"
  },
  {
    moduleId: NumberInt(1),
    name: "Standard Cogs Adjustments",
    typeCode: "revadj",
    statusFlag: "Y"
  },
  {
    moduleId: NumberInt(1),
    name: "Warranty",
    typeCode: "revadj",
    statusFlag: "Y"
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

// MAKE THIS BE LAST SO ALL TIMESTAMPED COLLECTIONS GET UPDATED
const collectionsWithCreatedUpdated = [
  'dfa_allocation_rule',
  'dfa_submeasure',
  'prof_dollar_upload',
  'dfa_measure',
  'dfa_open_period',
  'prof_mapping_upload',
  'prof_sales_split_pct',
  'prof_swalloc_manual_mix',
  'prof_department_acc_map'
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

