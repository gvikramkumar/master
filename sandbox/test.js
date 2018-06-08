const _ = require('lodash'),
  Q = require('q');


str = '123_456789';

console.log(/^\d{3}_\d{6}$/.test(str))
console.log(/^(\d{3})_(\d{6})$/.test(str))


console.log(str.match(/^(\d{3})_(\d{6})$/));
