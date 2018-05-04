const _ = require('lodash'),
  mg = require('mongoose');

mg.connect('mongodb://localhost:27017/fin-dfa', () => {
  const db = mg.connection.db;
  db.collection('allocation_rule').find().toArray()
    .then(rules => rules.map(rule => rule.name))
    .then(rules => console.log(rules))
})














