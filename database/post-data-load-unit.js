const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
db.dfa_user.insertOne({
  "roles" : [
    "it administrator"
  ],
  "userId" : "jodoe",
  "fullName" : "John Doe",
  "email" : "jodoe@cisco.com",
  "updatedDate" : ISODate("2019-04-14T21:11:26.366Z"),
});

db.dfa_submeasure.insertMany([
  {
    _id : ObjectId("5cd5c201b2db8208c0cb4c2f"),
    submeasureId: NumberInt(1),
    submeasureKey: NumberInt(1),
    moduleId: NumberInt(1),
    name: "2 Tier Adjustment",
    desc: "2 Tier Adjustment",
    sourceId: NumberInt(4),
    measureId: NumberInt(1), // for manual upload
    startFiscalMonth: NumberInt(201905),
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
      manualMapping: "N",
      groupFlag: 'N',
      retainedEarnings: 'N',
      transition: 'N',
      corpRevenue: 'Y',
      dualGaap: 'N',
      twoTier: 'N',
      deptAcct: 'N',
      service: 'N',
      allocationRequired: 'N',
      passThrough: 'N'
    },
    rules: ['2TSUBDIR-MTD', 'SHIPREV-QTD'],
    activeStatus: "A",
    status: "A",
    approvedOnce: "Y",
    "createdBy" : "jodoe",
    "createdDate" : ISODate("2018-12-01T00:11:48.440Z"),
    "updatedBy" : "jodoe",
    "updatedDate" : ISODate("2018-12-01T00:11:48.450Z"),
    "approvedBy" : "jodoe",
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z")
  },
  {
    submeasureId: NumberInt(2),
    submeasureKey: NumberInt(2),
    moduleId: NumberInt(1),
    name: "2 Tier Adjustment2",
    desc: "2 Tier Adjustment2",
    sourceId: NumberInt(4),
    measureId: NumberInt(2), // for manual upload
    startFiscalMonth: NumberInt(201905),
    endFiscalMonth: NumberInt(204012),
    processingTime: "Daily",
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
      manualMapping: "N",
      groupFlag: 'N',
      retainedEarnings: 'N',
      transition: 'N',
      corpRevenue: 'Y',
      dualGaap: 'N',
      twoTier: 'N',
      deptAcct: 'N',
      service: 'N',
      allocationRequired: 'N',
      passThrough: 'N'
    },
    rules: ['2TSUBDIR-MTD', 'GLREVMIX-ROLL3'],
    activeStatus: "A",
    status: "A",
    approvedOnce: "Y",
    "createdBy" : "jodoe",
    "createdDate" : ISODate("2018-12-01T00:11:48.440Z"),
    "updatedBy" : "jodoe",
    "updatedDate" : ISODate("2018-12-01T00:11:48.450Z"),
    "approvedBy" : "jodoe",
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z")
  }
]);

db.dfa_allocation_rule.insertMany([
  {
    "name" : "2TSUBDIR-MTD",
    "oldName" : "RULE1",
    "desc" : "Name:  2TSUBDIR-MTD\nOld Name:  RULE1\nDriver:  2T Subscription Revenue\nPeriod:  MTD",
    "moduleId" : 1,
    "activeStatus" : "A",
    "status" : "A",
    "approvedOnce" : "Y",
    "driverName" : "2TSUBDIR",
    "period" : "MTD",
    "glSegmentsMatch" : [],
    "createdBy" : "jodoe",
    "createdDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "updatedBy" : "jodoe",
    "updatedDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "approvedBy" : "jodoe",
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z")
  },
  {
    "name" : "SHIPREV-QTD",
    "oldName" : "RULE2",
    "desc" : "Name:  SHIPREV-QTD\nOld Name:  RULE2\nDriver:  Shipped Revenue\nPeriod:  QTD",
    "glSegmentsMatch" : [],
    "activeStatus" : "A",
    "status" : "A",
    "approvedOnce" : "Y",
    "driverName" : "SHIPREV",
    "period" : "QTD",
    "moduleId" : 1,
    "createdBy" : "jodoe",
    "createdDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "updatedBy" : "jodoe",
    "updatedDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "approvedBy" : "jodoe",
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z")
  },
  {
    "name" : "GLREVMIX-ROLL3",
    "oldName" : "RULE3",
    "desc" : "Name:  GLREVMIX-ROLL3\nOld Name:  RULE3\nDriver:  Net Revenue\nPeriod:  ROLL3",
    "glSegmentsMatch" : [],
    "activeStatus" : "A",
    "status" : "A",
    "approvedOnce" : "Y",
    "driverName" : "GLREVMIX",
    "period" : "ROLL3",
    "moduleId" : 1,
    "createdBy" : "jodoe",
    "createdDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "updatedBy" : "jodoe",
    "updatedDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "approvedBy" : "jodoe",
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z")
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
 // 'dfa_submeasure',
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

