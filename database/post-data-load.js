const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

const collectionsWithCreatedUpdated = [
  'allocation_rule',
  'submeasure',
  'submeasure_rule',
  'dollar_upload'
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

db.getCollection('submeasure').insert({
  name:"2 Tier Adjustment",
  description:"2 Tier Adjustment",
  source:"manual",
  measureName:"Indirect Revenue Adjustments",
  startFiscalMonth:201810,
  endFiscalMonth:204012,
  processingTime:"Monthly",
  pnlnodeGrouping:"Indirect Adjustments",
  inputfilterLevel:{productLevel:"PF",salesLevel:"level1",scsmsLevel:"",internalBELevel:"",entityLevel:""},
  manualMapping:{productLevel:"",salesLevel:"",scmsLevel:"",internalBELevel:"",entityLevel:""},
  reportingLevels:[],
  indicators:{dollaruploadFlag:"Y",discountFlag:"N",approveFlag:"Y",status:"A",manualmapping:"Y"},
  rules:["2TierPOSPID","2TierPOSBE"]})

print('post-data-load complete');

