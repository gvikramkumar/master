const _ = require('lodash'),
  mg = require('mongoose');

let limit, skip;
limit = '5';
skip = '5';
mg.connect('mongodb://localhost:27017/fin-dfa', () => {
  const db = mg.connection.db;
  const cur = db.collection('allocation_rule').find().sort({name:1});

  if (limit && skip) {
    cur.skip(+skip).limit(+limit)
  }
  cur.toArray()
    .then(rules => rules.map(rule => rule.name))
    .then(rules => console.log(rules))
})














