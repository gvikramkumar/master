print(`host: ${host}, port: ${port}, db: ${_db}, user: ${user}, pass: ${pass}`);

let uri;
if (user && pass) {
  uri = `mongodb://${user}:${pass}@${host}:${port}/${_db}`;
} else {
  uri = `mongodb://${host}:${port}/${_db}`;
}
print(uri);
db = connect(uri);

db.dfa_lookup.findOneAndUpdate({key: 'drivers'}, {$pull: {value: {name: /E2ETEST/}}});
db.dfa_lookup.findOneAndUpdate({key: 'periods'}, {$pull: {value: {period: /E2ETEST/}}});
db.dfa_allocation_rule.deleteMany({name: /E2ETEST/});
db.dfa_submeasure.deleteMany({name: /E2ETEST/});
db.dfa_module.deleteMany({name: /E2ETEST/});
db.dfa_data_source.deleteMany({name: /E2ETEST/});
db.dfa_open_period.deleteMany({moduleId: {$gte: 12}});

print('>>>>>>> remove-test-data-complete');
