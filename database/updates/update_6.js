
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);


db.dfa_allocation_rule.find().forEach(rule => {
  if (rule.salesCritCond || (rule.salesCritChoices && rule.salesCritChoices.length)) {
    db.dfa_allocation_rule.updateOne({_id: rule._id}, {$set: {salesSL1CritCond: rule.salesCritCond, salesSL1CritChoices: rule.salesCritChoices}});
  }
});

db.dfa_allocation_rule.updateMany({}, {$unset: {salesCritCond: '', salesCritChoices: ''}});
