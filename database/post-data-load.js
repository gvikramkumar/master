const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.submeasure.insertMany([
  {
    name: "22 Tier Adjustment",
    description: "2 Tier Adjustment",
    source: "manual",
    measureName: "Indirect Revenue Adjustments",
    startFiscalMonth: 201810,
    endFiscalMonth: 204012,
    processingTime: "Monthly",
    pnlnodeGrouping: "Indirect Adjustments",
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
    reportingLevels: [],
    indicators: {
      dollarUploadFlag: "Y",
      discountFlag: "N",
      approveFlag: "Y",
      status: "A",
      manualMapping: "Y",
      expenseSSOT: "Y",
      manualMix: "Y"
    },
    rules: ["2TierPOSPID", "2TierPOSBE"]
  },
  {
    name: "2 Tier Adjustment",
    description: "2 Tier Adjustment",
    source: "manual",
    measureName: "Indirect Revenue Adjustments",
    startFiscalMonth: 201810,
    endFiscalMonth: 204012,
    processingTime: "Monthly",
    pnlnodeGrouping: "Indirect Adjustments",
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
    reportingLevels: [],
    indicators: {
      dollarUploadFlag: "Y",
      discountFlag: "N",
      approveFlag: "Y",
      status: "A",
      manualMapping: "Y",
      expenseSSOT: "Y"
    },
    rules: ["2TierPOSPID", "2TierPOSBE"]
  },
  {
    name: "2 Tier Adjustment2",
    description: "2 Tier Adjustment2",
    source: "manual",
    measureName: "Indirect Revenue Adjustments2",
    startFiscalMonth: 201810,
    endFiscalMonth: 204012,
    processingTime: "Monthly",
    pnlnodeGrouping: "Indirect Adjustments",
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
    reportingLevels: [],
    indicators: {dollarUploadFlag: "Y", discountFlag: "N", approveFlag: "Y", status: "A", manualMapping: "Y"},
    rules: ["2TierPOSPID", "2TierPOSBE"]
  }
])

db.user_role.insertOne({
  userId: "jodoe",
  role: "Indirect Revenue Adjustments"
})

db.dollar_upload.insertOne({
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

db.measure.insertMany([
  {
    name: "Indirect Revenue Adjustments",
    typeCode: "revadj",
    statusFlag: "Y"
  },
  {
    name: "Indirect Revenue Adjustments2",
    typeCode: "revadj2",
    statusFlag: "Y"
  }
])

db.open_period.insert({
  fiscalMonth: 201809,
  openFlag: "Y"
})

db.mapping_upload.insert({
  fiscalMonth: 201809,
  submeasureName: "2 Tier Adjustment",
  product: "UCS",
  sales: "Americas",
  legalEntity: "Japan",
  intBusinessEntity: "collaboration",
  scms: "enterprise",
  percentage: 458.58
})

db.expense_SSOT_map.insertOne({
  submeasureName: "2 Tier Adjustment",
  hierarchyName: "pl_hierarchy",
  nodeLevelValue: "node_level03_name",
  nodeId: "375821",
  glAccount: "60001"
})

db.lookup.insertMany([
  {
    type: 'revenue_classification',
    values: ["Recurring Deferred", "Recurring Non Deferred", "Recurring Other", "Non Recurring"]
  },
]);

db.sales_split_pct.insertOne({
  fiscalMonth:201810,
  accountID:"42127",
  companyCode:"555",
  subAccountCode:"033",
  salesTerritoryCode: "AFRICA-PROG-REB-COMM",
  split_pct: 0.2});

db.swalloc_manual_mix.insertOne({
  fiscalMonth:201810,
  subMeasureName:"2 Tier",
  splitCategory:"HARDWARE",
  splitPercentage:1});

// MAKE THIS BE LAST SO ALL TIMESTAMPED COLLECTIONS GET UPDATED
const collectionsWithCreatedUpdated = [
  'allocation_rule',
  'submeasure',
  'dollar_upload',
  'measure',
  'open_period',
  'mapping_upload',
  'expense_SSOT_map',
  'sales_split_pct',
  'swalloc_manual_mix'
];

const date = new Date();
collectionsWithCreatedUpdated.forEach(coll => {
  db.getCollection(coll).updateMany({}, {
    $set: {
      createdBy: '',
      createdDate: date,
      updatedBy: '',
      updatedDate: date
    }
  });
});

print('>>>>>>>>>> post-data-load complete');

