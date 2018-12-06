
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

db.dfa_measure.find().forEach(measure => {
  let reportingLevels = [];
  let reportingLevelEnableds = [];
  if (measure.reportingLevel1 || measure.reportingLevel2 || measure.reportingLevel3) {
    reportingLevels = [measure.reportingLevel1, measure.reportingLevel2, measure.reportingLevel3]
  }
  reportingLevelEnableds = [measure.reportingLevel1Enabled || false, measure.reportingLevel2Enabled || false, measure.reportingLevel3Enabled || false]
  db.dfa_measure.updateOne({_id: measure._id}, {$set: {reportingLevels, reportingLevelEnableds}});

});

db.dfa_measure.updateMany({}, {$unset: {
    reportingLevel1: '',
    reportingLevel2: '',
    reportingLevel3: '',
    reportingLevel1Enabled: '',
    reportingLevel2Enabled: '',
    reportingLevel3Enabled: ''
}});
