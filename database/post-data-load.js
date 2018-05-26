const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.submeasure.insertMany([
  {
    name:"2 Tier Adjustment",
    description:"2 Tier Adjustment",
    source:"manual",
    measureName:"Indirect Revenue Adjustments",
    startFiscalMonth:201810,
    endFiscalMonth:204012,
    processingTime:"Monthly",
    pnlnodeGrouping:"Indirect Adjustments",
    inputFilterLevel:{productLevel:"PF",salesLevel:"level1",scmsLevel:"SCMS",internalBELevel:"Internal BE",entityLevel:"BE"},
    manualMapping:{productLevel:"TG",salesLevel:"level2",scmsLevel:"SCMS",internalBELevel:"Internal SUB BE",entityLevel:"BE"},
    reportingLevels:[],
    indicators:{dollaruploadFlag:"Y",discountFlag:"N",approveFlag:"Y",status:"A",manualmapping:"Y"},
    rules:["2TierPOSPID","2TierPOSBE"]
  },
  {
    name:"2 Tier Adjustment2",
    description:"2 Tier Adjustment2",
    source:"manual",
    measureName:"Indirect Revenue Adjustments",
    startFiscalMonth:201810,
    endFiscalMonth:204012,
    processingTime:"Monthly",
    pnlnodeGrouping:"Indirect Adjustments",
    inputFilterLevel:{productLevel:"TG",salesLevel:"level3",scmsLevel:"SCMS",internalBELevel:"Internal SUB BE",entityLevel:"BE"},
    manualMapping:{productLevel:"PF",salesLevel:"level4",scmsLevel:"SCMS",internalBELevel:"Internal BE",entityLevel:"BE"},
    reportingLevels:[],
    indicators:{dollaruploadFlag:"Y",discountFlag:"N",approveFlag:"Y",status:"A",manualmapping:"Y"},
    rules:["2TierPOSPID","2TierPOSBE"]
  }
  ])

db.user_role.insertOne({
  userId:"jodoe",
  role:"Indirect Revenue Adjustments"
})

db.dollar_upload.insertOne({
  fiscalMonth: 201809,
  submeasureName:"2 Tier Adjustment",
  product:"UCS",
  sales:"Americas",
  legalEntity:"Japan",
  intBusinessEntity:"collaboration",
  scms:"enterprise",
  dealId:"",
  grossUnbilledAccruedFlag:"N",
  revenueClassification:"Non Recurring",
  amount:450.57});

db.measure.insertOne({
  name:"Indirect Revenue Adjustments",
  typeCode:"revadj",
  statusFlag:"Y"
})

db.open_period.insert({
  fiscalMonth:201809,
  openFlag:"Y"
})

db.mapping_upload.insert({
  fiscalMonth: 201809,
  submeasureName:"2 Tier Adjustment",
  product:"UCS",
  sales:"Americas",
  legalEntity:"Japan",
  intBusinessEntity:"collaboration",
  scms:"enterprise",
  percentage:450.57})

db.lookup.insertMany([
  {type: 'revenue_classification', values:  ["Recurring Deferred","Recurring Non Deferred","Recurring Other","Non Recurring"]},
]);

// MAKE THIS BE LAST SO ALL TIMESTAMPED COLLECTIONS GET UPDATED
const collectionsWithCreatedUpdated = [
  'allocation_rule',
  'submeasure',
  'dollar_upload',
  'measure',
  'open_period',
  'mapping_upload'
];

const date = new Date();
collectionsWithCreatedUpdated.forEach(coll => {
  db.getCollection(coll).updateMany({}, {$set: {
      createdBy: '',
      createdDate: date,
      updatedBy: '',
      updatedDate: date
    }});
});

print('>>>>>>>>>> post-data-load complete');

