const _ = require('lodash'),
  Q = require('q');


const a = {name: 'dank', age: 50, lint: 'li', rules: ['one', 'two'], obj: {stuff: 'lala', arr: [3], dat: 5}};
const b = {name: 'carl', age: 60, rules: ['three', 'four'], obj: {stuff: 'lala2', arr: [4, 2]}};

console.log(_.merge(a, b));
