const _ = require('lodash'),
  Q = require('q');

const a = {name:'dank', age: 50};

for (const key in a) {
  console.log(key, a[key]);
}

