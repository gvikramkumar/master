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

db.dfa_lookup.insertMany([
  {
    key: 'database-version',
    value: 17
  },
  {
    key: 'build-number',
    value: "0"
  },
  {
    key: 'itadmin-email',
    value: 'dfa-admin@cisco.com'
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
        }
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
        "period" : "PRIOR ROLL3"
      },
      {
        "period" : "PRIOR ROLL6"
      },
      {
        "period" : "PERCENT"
      }
    ]
  }
]);

db.dfa_module_data_source.insertMany([
  {moduleId: NumberInt(1), sources: [NumberInt(1),NumberInt(2), NumberInt(3),NumberInt(4)]}
])

// MAKE THIS BE LAST SO ALL TIMESTAMPED COLLECTIONS GET UPDATED
const collectionsWithCreatedUpdated = [
  'dfa_allocation_rule',
  'dfa_data_source',
  'dfa_measure',
  'dfa_submeasure',
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

