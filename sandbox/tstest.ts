import * as _ from 'lodash';


console.log(createSelect('in', ['one', 'two']));

function createSelect(cond, choices) {
  let sql = ` ${cond} ( `;
  choices.forEach((choice, idx) => {
    sql += `'${choice.trim()}'`;
    if (idx < choices.length - 1) {
      sql += ', ';
    }
  });
  sql += ` ) `;
  return sql;
}


/*
const arr1 = [
  { moduleId: 1, name: 'dank'},
  {moduleId: 1, name: 'mary', age: 20},
  {moduleId: 1, name: 'carl', age: 60},
  {moduleId: 2, name: 'dank', age: 50},
  {moduleId: 2, name: 'mary', age: 20},
  {moduleId: 2, name: 'carl', age: 60},
  {moduleId: 3, name: 'jim', age: 40},
];
const arr2 = [
  { moduleId: 1, name: 'dank'},
  {moduleId: 1, name: 'maryx', age: 20},//no
  {moduleId: 1, name: 'carl', age: 60},
  {moduleId: 2, name: 'dankx', age: 50},//no
  {moduleId: 2, name: 'mary', age: 20},
  {moduleId: 22, name: 'carl', age: 60},//no
  {moduleId: 3, name: 'jim', age: 40},
];


function   createPredicateFromProperties(props) {
  return function(a, b) {
    if (!props.length) {
      return false;
    }
    let bool = true;
    props.forEach(prop => bool = bool &&
      (a[prop] !== undefined && b[prop] !== undefined && a[prop] === b[prop]));
    return bool;
  };
}

const pred = (a, b) => a.moduleId === b.moduleId && a.name === b.name;
console.log(_.intersectionWith(arr1, arr2, createPredicateFromProperties(['moduleId', 'name', 'age']))
// console.log(_.intersectionWith([arr1, arr2], (a,b) => a.name === b.name));
*/

/*
const matches = [];
arr1.forEach(a => {
  arr2.forEach(b => {
    // console.log(a,b);
    if (createPredicateFromProperties(['moduleId', 'name'])(a,b)) {
      matches.push(a);
    }
  });
});

console.log(matches);

*/

/*
const repo = new OpenPeriodPostgresRepo();

const date = new Date().toISOString();

const one = {
  moduleId: 5,
  fiscalMonth: 201809,
  openFlag: 'Y',
  createdBy: 'system',
  createdDate: date,
  updatedBy: 'system',
  updatedDate: date,
}
const two = {
  moduleId: 6,
  fiscalMonth: 201810,
  openFlag: 'N',
  createdBy: 'system',
  createdDate: date,
  updatedBy: 'system',
  updatedDate: date,
}

const a = pgc.promise;
pgc.promise.then(db => {
  console.log('postgres is up');

  try {
    repo.getMany({moduleId: 1, openFlag: 'Y'})
    // repo.getOne({moduleId: 1})
    // repo.addOne(one)
    // repo.addMany([one, two])
    // repo.updateOne(one, {moduleId: 1})
    // repo.deleteAll()
    // repo.deleteMany({moduleId: 1})
    // repo.deleteOne({moduleId: 1})
      .then(docs => {
        console.log(docs);
        process.exit();
      });

  } catch (e) {
    console.log(JSON.stringify(e));
    process.exit(1);
  }







  process.exit();
})
  .catch(err => {
    console.log('postgres is down');
    console.error(err);
    process.exit();
  });



*/
