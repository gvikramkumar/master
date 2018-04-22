const _ = require('lodash');



const s = ' ';
if (s) {
  console.log('exist')
} else {
  console.log('no');
}

var object = {
  'a': [{ 'b': 2 }, { 'd': 4 }],
  arr: [1,2]
};

var other = {
  'a': [{ 'c': 3 }, { 'e': 5 }],
  arr: [3,4,5]
};

console.log(_.merge(object, other));
console.log(_.assign(object, other));
// => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
