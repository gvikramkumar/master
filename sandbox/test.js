const _ = require('lodash'),
  Q = require('q');






class myclass {
  pad (number, digits) {
    number = '' + number
    while (number.length < digits) { number = '0' + number }
    return number
  }

// stolen from node-postgres/lib/util.js, converts date to postgres string
  dateToString (date) {
    let offset = -date.getTimezoneOffset()
    let ret = this.pad(date.getFullYear(), 4) + '-' +
      this.pad(date.getMonth() + 1, 2) + '-' +
      this.pad(date.getDate(), 2) + 'T' +
      this.pad(date.getHours(), 2) + ':' +
      this.pad(date.getMinutes(), 2) + ':' +
      this.pad(date.getSeconds(), 2) + '.' +
      this.pad(date.getMilliseconds(), 3)

    if (offset < 0) {
      ret += '-';
      offset *= -1;
    } else { ret += '+'; }

    return ret + this.pad(Math.floor(offset / 60), 2) + ':' + this.pad(offset % 60, 2)
  }

}


console.log(new myclass().dateToString(new Date()));




/*
const date = new Date(new Date('2018-07-21T02:14:47.481Z'));

const a = new Date().toISOString();
const b = new Date(a);
console.log(a);
console.log(b.toISOString());
*/

/*
console.log(date.toString())
console.log(date.toLocaleString())
console.log(date.toISOString())
console.log(date.getTimezoneOffset());
console.log(moment('2018-07-21T02:14:47.481Z').format('YYYY-MM-DD HH:mm:ssZ'))
*/
