import * as _ from 'lodash';
// import {Subject, BehaviorSubject} from 'rxjs';
// import {take, first} from 'rxjs/operators';


const arr = ['one$ne$', 'two'];

function test(keys) {
  keys.forEach((key, idx) => {
    if (key.indexOf('$ne$') > 0) {
      key = key.substr(0, key.length - 4);
      arr[idx] = key;
    }
  });
}

console.log(arr);
test(arr);
console.log(arr);

/*
//const str = 'module_id, sub_measure_key, sub_measure_id, sub_measure_name, sub_measure_description, category_type, grouped_by_smeasure_key, measure_id, source_system_id, source_system_adj_type_id, start_fiscal_period_id, end_fiscal_period_id, processing_frequency, pnlnode_grouping, dollar_upld_flag, manual_mapping_flag, dept_acct_flag, approve_flag, change_approve_flag, status_flag, retained_earnings_flag, transition_flag, corporate_revenue_flag, dual_gaap_flag, twotier_flag, gross_mgn_rollup1, gross_mgn_rollup2, gross_mgn_rollup3, gl_acct_number, create_owner, create_datetimestamp, update_owner, update_datetimestamp, rule1, rule2, rule3, rule4, rule5';

const str =  'module_id, sub_measure_key, hierarchy_id, input_level_flag, level_id, level_name, create_owner, create_datetimestamp, update_owner, update_datetimestamp';



console.log(str.split(',').map(x => x.trim()).join('\n'));

*/



/*
let init = false;
const init$ = new BehaviorSubject<boolean>(init);
// const init$ = new Subject<number>();
const subInit = init$.subscribe.bind(init$);
function pubInit(val) {
  if (val) {
    init = val;
    init$.next(init);
    init$.complete();
  }
}

const promise = init$.asObservable().toPromise();

  promise.then(val => {
    console.log('init1', val);
  });

  setTimeout(() => {
    pubInit(true);

    setTimeout(() => {
      promise.then(val => console.log('init2', val));
    }, 1000);

  }, 1000);

*/

/*
const promise = init$.asObservable().toPromise();

pubInit(true);

promise.then(val => {
  console.log('init', val);
});


setTimeout(() => {

  const promise2 = init$.asObservable().toPromise()
    .then(val => {
      console.log('init2', val);
    });
}, 1000);

*/






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
const repo = new OpenPeriodPgRepo();

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
