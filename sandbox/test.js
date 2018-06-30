const _ = require('lodash'),
  Q = require('q');

function getDateRangeFromFiscalYearMo(_yearmo) {
  let yearmo = _yearmo;
  if (typeof yearmo === 'number') {
    yearmo = yearmo.toString();
  }
  const year = Number(yearmo.substr(0, 4));
  const month = Number(yearmo.substr(4, 2));


  let startDate = new Date(year, month - 6);
  let endDate = new Date(year, month - 5);

  return {startDate, endDate};
}

console.log(getDateRangeFromFiscalYearMo(201901))
