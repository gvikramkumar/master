const _ = require('lodash'),
  Q = require('q');


function getRangesFromGlAccounts(accts) {
  const ranges = [];

  if (accts.length === 1) {
    const acct = accts[0];
    if (acct === 60000) {
      ranges.push({start: 60001, end: 69999})
    } else if (acct === 69999) {
      ranges.push({start: 60000, end: 69998})
    } else {
      ranges.push({start: 60000, end: acct - 1})
      ranges.push({start: acct + 1, end: 69999})
    }
    ranges[0].acct = acct;
    return ranges;
  }

  accts.forEach((acct, idx) => {

    // if first one
    if (idx === 0) {
      if (acct === 60000) {
      } else {
        ranges.push({start: 60000, end: acct - 1})
      }
    }
    // if last one
    else if (idx + 1 === accts.length) {
      if (acct === 69999) {
        if (accts[idx - 1] === 60000) {
          ranges.push({start: 60001, end: 69998})
        } else {
          ranges.push({start: accts[idx - 1] + 1, end: 69998})
        }
      } else {
        if (accts[idx - 1] === 60000) {
          ranges.push({start: 60001, end: acct - 1})
          ranges.push({start: acct + 1, end: 69999})
        } else {
          ranges.push({start: accts[idx - 1] + 1, end: acct - 1})
          ranges.push({start: acct + 1, end: 69999})
        }
      }
    }
    // middle one
    else {
      // oddly enough, handles the 60000 start case on its own
      ranges.push({start: accts[idx - 1] + 1, end: acct - 1})
    }

  })

  accts.forEach((acct, idx) => {
    ranges[idx].acct = acct;
  })
  return ranges;
}

// console.log(getRangesFromGlAccounts([60000]));
// console.log(getRangesFromGlAccounts([69999]));
// console.log(getRangesFromGlAccounts([60010]));
// console.log();
// console.log(getRangesFromGlAccounts([60000, 60010]));
// console.log(getRangesFromGlAccounts([60010, 69999]));
// console.log(getRangesFromGlAccounts([60010, 60020]));
// console.log();
// console.log(getRangesFromGlAccounts([60000, 60010, 60020]));
// console.log(getRangesFromGlAccounts([60010, 60020, 69999]));
console.log(getRangesFromGlAccounts([60010, 60020, 60030]));
// console.log();
// console.log(getRangesFromGlAccounts([60010, 60020, 69950, 69960]));


