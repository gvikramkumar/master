
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

// remove bad properties from rule selection criteria messup
db.dfa_allocation_rule.updateMany({}, {$unset: {
    countrySelect: '',
    countryCritCond: '',
    countryCritChoice: '',
    extTheaterSelect: '',
    extTheaterCritCond: '',
    extTheaterCritChoice: ''
  }});

