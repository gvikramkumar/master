const _ = require('lodash'),
  Q = require('q');

function getFiscalMonthListFromDate(date, numMonths) {
  const yearmos = [];
  const months = _.range(date.getMonth() + 5, date.getMonth() + 5 - numMonths);
  console.log(months);

  months.forEach(mon => {
    date.setMonth(mon);
    month = date.getMonth() + 1;
    yearmos.push('' + date.getFullYear() + (month < 10? '0' + month : month) )
  })

  return yearmos;
}

console.log(getFiscalMonthListFromDate(new Date(), 18));
