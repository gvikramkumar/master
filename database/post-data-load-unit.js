const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_submeasure.insertMany([
  {
    submeasureId: NumberInt(1),
    submeasureKey: NumberInt(1),
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
      salesLevel: "LEVEL1",
      scmsLevel: "SCMS",
      internalBELevel: "INTERNAL BE",
      entityLevel: "BE"
    },
    manualMapping: {},
    reportingLevels: [null, "Indirect Revenue Adjustments", null],
    indicators: {
      dollarUploadFlag: "Y",
      manualMapping: "Y",
      expenseSSOT: "Y",
      manualMix: "Y",
      groupFlag: 'N',
      retainedEarnings: 'N',
      transition: 'N',
      corpRevenue: 'Y',
      dualGaap: 'N',
      twoTier: 'N',
      deptAcct: 'N',
      service: 'N'
    },
    rules: ["TEST_RULE_1", "TEST_RULE_2"],
    activeStatus: "A",
    status: "A",
    approvedOnce: "Y",
  },
  {
    submeasureId: NumberInt(2),
    submeasureKey: NumberInt(2),
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
      salesLevel: "LEVEL3",
      scmsLevel: "SCMS",
      entityLevel: "BE"
    },
    manualMapping: {},
    reportingLevels: ["Manufacturing Overhead"],
    indicators: {
      dollarUploadFlag: "Y",
      manualMapping: "Y",
      expenseSSOT: "Y",
      manualMix: "Y",
      groupFlag: 'Y',
      retainedEarnings: 'N',
      transition: 'N',
      corpRevenue: 'Y',
      dualGaap: 'N',
      twoTier: 'N',
      deptAcct: 'N',
      service: 'N'
    },
    rules: ["TEST_RULE_3", "TEST_RULE_4"],
    activeStatus: "A",
    status: "A",
    approvedOnce: "Y",
  }
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

