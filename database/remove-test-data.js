// print(`host: ${host}, port: ${port}, db: ${_db}, user: ${user}`);
print(`host: ${host}, port: ${port}, db: ${_db}`);

let uri;
// to run with user/pass:
// uri = `mongodb://${user}:${pass}@${host}:${port}/${_db}`;
// to run without user/pass:
uri = `mongodb://${host}:${port}/${_db}`;
print(uri);

db = connect(uri);

db.dfa_lookup.findOneAndUpdate({key: 'drivers'}, {$pull: {value: {name: /E2ETEST/}}});
db.dfa_lookup.findOneAndUpdate({key: 'periods'}, {$pull: {value: {period: /E2ETEST/}}});
db.dfa_allocation_rule.deleteMany({name: /E2ETEST/});
db.dfa_submeasure.deleteMany({name: /E2ETEST/});

print('>>>>>>> remove-test-data-complete');
