const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);


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

// temp fix: ram's backend upload is not setting approvedOnce and setting glSegmentsMatch to an empty string
db.getCollection('dfa_allocation_rule').updateMany({}, {$set: {approvedOnce: 'Y'}});
db.getCollection('dfa_allocation_rule').updateMany({glSegmentsMatch: ''}, {$set: {glSegmentsMatch: []}});

db.dfa_lookup.insertMany([
  {
    key: 'database-version',
    value: 20
  },
  {
    key: 'build-number',
    value: "0"
  },
  {key: 'dfa-admin-email', value: 'dfa-admin@cisco.com'},
  {key: 'dfa-biz-admin-email', value: 'dfa_business_admin@cisco.com'},
  {
    key: 'itadmin-email',
    value: 'dfa-it-admin@cisco.com'
  },
  {key: 'generic-users', value: ['dfaadmin.gen', 'dakahle', 'rsamband', 'amalakar']},
  {key: 'ppmt-email', value: 'dfa-ppmt@cisco.com'},
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
  {
    key: 'drivers',
    value: [
      {
        "name" : "Software POS Revenue",
        "value" : "POSREVSW"
      },
      {
        "name" : "Svc Channel Revenue",
        "value" : "MSCP"
      },
      {
        "name" : "Shipped Revenue",
        "value" : "SHIPREV"
      },
      {
        "name" : "POS Revenue",
        "value" : "REVPOS"
      },
      {
        "name" : "Partner Dev Fund",
        "value" : "PDF"
      },
      {
        "name" : "Gross Revenue CMDM",
        "value" : "GLREV"
      },
      {
        "name" : "Legacy Driver",
        "value" : "LEGACYDRVR"
      },
      {
        "name" : "2T Subscription Revenue",
        "value" : "2TSUBDIR"
      },
      {
        "name" : "Net Revenue",
        "value" : "GLREVMIX"
      },
      {
        "name" : "Shipment",
        "value" : "SHIPMENT"
      },
      {
        "name" : "Remarketing Revenue",
        "value" : "REMKTREV"
      },
      {
        "name" : "VIP Rebate",
        "value" : "VIP"
      },
      {
        "name" : "POS Revenue Disty",
        "value" : "REVPOSDIS"
      },
      {
        "name" : "Svc Map",
        "value" : "SERVMAP"
      },
      {
        "name" : "Svc Sales Split PCT Map",
        "value" : "SERVSLSMAP"
      },
      {
        "name" : "Svc Training Split PCT Map",
        "value" : "SERVTRNMAP"
      },
      {
        "name" : "Svc Revenue",
        "value" : "SVCREVT3"
      },
      {
        "name" : "Def POS Revenue SW",
        "value" : "DRPOSREVSW"
      },
      {
        "name" : "Def Shipment",
        "value" : "DRSHIPMENT"
      },
      {
        "name" : "Def Ship Revenue SW",
        "value" : "DRSHPREVSW"
      },
      {
        "name" : "Default Driver DO NOT USE",
        "value" : "DEFAULT"
      },
      {
        "name" : "Shipped Revenue with POS Adj",
        "value" : "SHREVPOS"
      },
      // new triangulation rules ram's supposed to add
      {
        "name" : "AMERICASMISC",
        "value" : "AMERICASMISC"
      },
      {
        "name" : "CORPADJ",
        "value" : "CORPADJ"
      },
      {
        "name" : "EMERGINGMKTSMISC",
        "value" : "EMERGINGMKTSMISC"
      },
      {
        "name" : "USCANMISC",
        "value" : "USCANMISC"
      },
    ]
  },
  {
    "key" : "periods",
    "value" : [
      {
        "period" : "MTD"
      },
      {
        "period" : "QTD"
      },
      {
        "period" : "ROLL3"
      },
      {
        "period" : "ROLL6"
      },
      {
        "period" : "PRIOR ROLL3",
        "abbrev" : "PRIOR3"
      },
      {
        "period" : "PRIOR ROLL6",
        "abbrev" : "PRIOR6"
      },
      {
        "period" : "PERCENT",
        "abbrev" : "PCT"
      }
    ]
  }
]);

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
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z"),
    "approvalReminderTime" : ISODate("2019-05-09T15:25:05.926Z"),
    "approvalUrl" : "http://localhost:4200/prof/submeasure/edit/5cd5c201b2db8208c0cb4c2f;mode=view"
  },
  {
    _id : ObjectId("5ce2dc8cb227ac0eb621afe3"),
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
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z"),
    "approvalReminderTime" : ISODate("2019-05-09T15:25:05.926Z"),
    "approvalUrl" : "http://localhost:4200/prof/submeasure/edit/5ce2dc8cb227ac0eb621afe3;mode=view"
  }

]);

db.dfa_allocation_rule.insertMany([
  {
    "_id" : ObjectId("5ce2dc8cb227ac0eb621afe4"),
    "name" : "2TSUBDIR-MTD",
    "oldName" : "RULE1",
    "desc" : "Name:  2TSUBDIR-MTD\nOld Name:  RULE1\nDriver:  2T Subscription Revenue\nPeriod:  MTD",
    "moduleId" : 1,
    "activeStatus" : "A",
    "status" : "P",
    "approvedOnce" : "Y",
    "driverName" : "2TSUBDIR",
    "period" : "MTD",
    "glSegmentsMatch" : [],
    "createdBy" : "jodoe",
    "createdDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "updatedBy" : "jodoe",
    "updatedDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "approvedBy" : "jodoe",
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z"),
    "approvalReminderTime" : ISODate("2019-05-09T15:25:05.926Z"),
    "approvalUrl" : "http://localhost:4200/prof/rule-management/edit/5ce2dc8cb227ac0eb621afe4;mode=view"
  },
  {
    "_id" : ObjectId("5ce43e08658742ccf0d762e2"),
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
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z"),
    "approvalUrl" : "http://localhost:4200/prof/rule-management/edit/5ce43e08658742ccf0d762e2;mode=view"
  },
  {
    "_id" : ObjectId("5ce43e08658742ccf0d762e3"),
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
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z"),
    "approvalUrl" : "http://localhost:4200/prof/rule-management/edit/5ce43e08658742ccf0d762e3;mode=view"
  },
  {
    "_id" : ObjectId("5ce44a25282898d0c0ce8478"),
    "name" : "REVPOS-ROLL6",
    "oldName" : "RULE4",
    "desc" : "Name:  REVPOS-ROLL6\nOld Name:  RULE4\nDriver:  POS Revenue\nPeriod:  ROLL6",
    "moduleId" : 2,
    "activeStatus" : "A",
    "status" : "P",
    "approvedOnce" : "Y",
    "driverName" : "REVPOS",
    "period" : "ROLL6",
    "glSegmentsMatch" : [],
    "createdBy" : "jodoe",
    "createdDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "updatedBy" : "jodoe",
    "updatedDate" : ISODate("2019-05-01T19:42:44.327Z"),
    "approvedBy" : "jodoe",
    "approvedDate" : ISODate("2018-12-01T00:11:48.460Z"),
    "approvalReminderTime" : ISODate("2019-05-09T15:25:05.926Z"),
    "approvalUrl" : "http://localhost:4200/prof/rule-management/edit/5ce44a25282898d0c0ce8478;mode=view"
  },
]);

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
  // 'dfa_allocation_rule',
  // 'dfa_data_source',
  // 'dfa_measure',
  // 'dfa_submeasure',
  // 'dfa_module',
  // 'dfa_module_data_source',
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

