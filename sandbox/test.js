const _ = require('lodash');

const db = [
  {moduleId: 1, name: 'dank', age: 50},
  {moduleId: 1, name: 'mary', age: 20},//del
  {moduleId: 1, name: 'carl', age: 60},
  {moduleId: 2, name: 'dank', age: 50},
  {moduleId: 2, name: 'mary', age: 20},
  {moduleId: 2, name: 'carl', age: 60},//del
  {moduleId: 3, name: 'jim', age: 40},
];

const mine = [
  {moduleId: 1, name: 'dank', age: 51},//up
  {moduleId: 1, name: 'carl', age: 61},//up
  {moduleId: 2, name: 'dank', age: 51},//up
  {moduleId: 2, name: 'mary', age: 21},//up
  {moduleId: 3, name: 'jim', age: 41},//up
  {moduleId: 3, name: 'casey', age: 37},//add
  {moduleId: 4, name: 'goerge', age: 71},//add
  {moduleId: 4, name: 'barney', age: 38},//add
]

// const predicate = (a,b) => a.moduleId === b.moduleId && a.name === b.name;
const predicate = (a,b) => a.moduleId === b.moduleId && a.name === b.name;
moduleIds = [1,2,3,4]
const filter = {moduleId: {$in: moduleIds}}
const updates = _.intersectionWith(mine, db, predicate);
const adds = _.differenceWith(mine, db, predicate);
const deletes = _.differenceWith(db, mine, predicate);
console.log('updates', JSON.stringify(updates,null,2));
console.log('adds', JSON.stringify(adds,null,2));
console.log('deletes', JSON.stringify(deletes,null,2));




/*


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


*/


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
