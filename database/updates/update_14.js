
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

// remove database persistence of these helper arrays, they're in the UI now
db.dfa_allocation_rule.updateMany({}, {$unset: {
    salesSL1CritCond: '',
    salesSL2CritCond: '',
    salesSL3CritCond: '',
    prodPFCritCond: '',
    prodBUCritCond: '',
    prodTGCritCond: '',
    scmsCritCond: '',
    beCritCond: '',
    countryCritCond: '',
    externalTheaterCritCond: '',
    salesSL1CritChoices: '',
    salesSL2CritChoices: '',
    salesSL3CritChoices: '',
    prodPFCritChoices: '',
    prodBUCritChoices: '',
    prodTGCritChoices: '',
    scmsCritChoices: '',
    beCritChoices: ''
    // countryCritChoices: '',
    // externalTheaterCritChoices: ''
  }});


// remove rest of rule csv empty strings
db.dfa_allocation_rule.updateMany({salesMatch: ''}, {$unset: {salesMatch: ''}});
db.dfa_allocation_rule.updateMany({productMatch: ''}, {$unset: {productMatch: ''}});
db.dfa_allocation_rule.updateMany({scmsMatch: ''}, {$unset: {scmsMatch: ''}});
db.dfa_allocation_rule.updateMany({legalEntityMatch: ''}, {$unset: {legalEntityMatch: ''}});
db.dfa_allocation_rule.updateMany({beMatch: ''}, {$unset: {beMatch: ''}});
db.dfa_allocation_rule.updateMany({sl1Select: ''}, {$unset: {sl1Select: ''}});
db.dfa_allocation_rule.updateMany({scmsSelect: ''}, {$unset: {scmsSelect: ''}});
db.dfa_allocation_rule.updateMany({beSelect: ''}, {$unset: {beSelect: ''}});
