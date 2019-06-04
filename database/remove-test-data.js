const MongoClient = require('mongodb').MongoClient;
const args = process.argv;

const dbName = args[4];

let uri;
if (args[5] && args[6]) { // user/pass
  uri = `mongodb://${args[5]}:${args[6]}@${args[2]}:${args[3]}`;
} else {
  uri = `mongodb://${args[2]}:${args[3]}`;
}

const client = new MongoClient(uri, {useNewUrlParser: true});
client.connect(function (err) {
  if (err) {
    console.log(`Error connecting to the database: ${dbName}`, err);
  } else {
    console.log(`Connected to database: ${dbName}, removing test data...`);
    const db = client.db(dbName);
    db.collection('dfa_lookup').findOneAndUpdate({key: 'drivers'}, {$pull : {value: {name: /E2ETEST/}}});
    db.collection('dfa_lookup').findOneAndUpdate({key: 'periods'}, {$pull : {value: {period: /E2ETEST/}}});
    db.collection('dfa_allocation_rule').deleteMany({name: /E2ETEST/});
    db.collection('dfa_submeasure').deleteMany({name: /E2ETEST/});

    client.close().then(err => {
      console.log('>>>>>>>remove-test-data-complete');
    });
  }
});
