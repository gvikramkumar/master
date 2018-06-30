const _ = require('lodash'),
  Q = require('q');


const a = {
  name: 'dank',
  age: 50,
  lint: 'li',
  rules: ['one', 'two'],
  tags: [
    {name: 'jim', tag: 2}, {name: 'carl', tag: 3}
  ],
  obj: {
    stuff: 'lala',
    arr: [3],
    dat: 5
  }
};
const b = {
  name: 'mary',
  age: 20,
  lint: 'ma',
  rules: ['three'],
  tags: [
    {name: 'mary', tag: 2}, {name: 'carl', tag: 33}, {name: 'jim', tag: 44},
  ],
  obj: {
    stuff: 'lala',
    arr: [3],
    dat: 5
  }
};

console.log(_.merge(a, b));
