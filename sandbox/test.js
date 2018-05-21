const _ = require('lodash'),
  Q = require('q');

/*
let date = new Date(1978, 1);
// date.setHours(date.getHours()-8);
console.log(date, date.getHours(), date.getUTCHours())
return;
*/

let val = 197801;
console.log(test(val))


function test(_yearmo) {
  let yearmo = _yearmo;
  if (typeof yearmo === 'number') {
    yearmo = yearmo.toString();
  }
  const year = Number(yearmo.substr(0, 4));
  const month = Number(yearmo.substr(4, 2));


  let startDate = new Date(year, month - 1 + 7);
  let endDate = new Date(year, month - 1 + 8);

  return {startDate, endDate};
}
