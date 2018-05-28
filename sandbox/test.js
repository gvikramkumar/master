const _ = require('lodash'),
  Q = require('q');

function objToString(val) {
  if (typeof val === 'string') {
    return val;
  } else if (_.isNumber(val) || _.isBoolean(val)) {
    return String(val);
  } else if (_.isDate(val)) {
    return val.toISOString();
  } else if (typeof val === 'object') {
    return val.toString();
  } else {
    return '';
  }
}

class Pet {
  constructor(name) {
    this.name = 'glenda';
  }

}

console.log(objToString(undefined));
console.log(objToString(false));
console.log(objToString(true));
console.log(objToString(new Date()));
console.log(objToString('lala'));
console.log(objToString(0));
console.log(objToString(5));
console.log(objToString(new Pet));

