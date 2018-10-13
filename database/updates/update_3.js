
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);

// add genric users
db.dfa_lookup.insertOne({key: 'generic-users', value: ['dfaadmin.gen']});

db.dfa_module.updateMany({}, {$unset: {roles: ''}});
// update module role names
/*
db.dfa_module.find({moduleId: {$ne: 99}})
  .forEach(module => {
    const roles = `${module.name}:Business Admin, ${module.name}:Super User, ${module.name}:End User`.toLowerCase();
    db.dfa_module.updateOne({moduleId: module.moduleId}, {$set: {roles}});
  });
*/

// remove old role restriction
db.dfa_lookup.remove({key: {$in: ['akmehrot', 'kalaissu', 'heyeung', 'myjagade']}});
