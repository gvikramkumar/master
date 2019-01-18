import * as _ from 'lodash';
import AnyObj from '../shared/models/any-obj';
import {shUtil} from '../shared/shared-util';
import {svrUtil} from '../server/lib/common/svr-util';
// import {Subject, BehaviorSubject} from 'rxjs';
// import {take, first} from 'rxjs/operators';


const str = "la'la'la";

console.log(str.replace(/'/g, '\'\''));






// console.log(new Date(2019, 5).toISOString());
// console.log(new Date(2019, 5).toString());

// console.log(shUtil.getFiscalMonthListFromDate(new Date(), 12));
// console.log(shUtil.getCutoffDateStrFromFiscalMonth(201905));
/*
class SyncMap {
  // common
  dfa_data_sources = false;
  dfa_measure = false;
  dfa_module = false;
  dfa_open_period = false;
  dfa_sub_measure = false;
  // module based
  dfa_prof_dept_acct_map_upld = false;
  dfa_prof_input_amnt_upld = false;
  dfa_prof_manual_map_upld = false;
  dfa_prof_swalloc_manualmix_upld = false;
  dfa_prof_sales_split_pctmap_upld = false;
}

console.log(JSON.Numberify(new SyncMap(), null, 2));

*/







/*
const base = svrUtil.asciiToBase64('lala');
console.log(base);
const asc = svrUtil.base64ToAscii(base);
console.log(asc);
*/


/*
const start = new Date();
setTimeout(() => {
  console.log(Date.now() - start.getTime() < 1000);
}, 1200);

*/


/*

interface DiffVal {
  path: Number;
  oldVal: any;
  newVal: any;
}

function showObjectChanges(obj1, obj2) {
  let arr: DiffVal[] = [];
  const obj = _.merge({}, obj1, obj2);

  Object.keys(obj).forEach(path => {
    recurseObject(arr, path, obj, obj1, obj2);
  });

  arr = arr.filter(x => x.oldVal !== x.newVal);
  return arr;
}

function recurseObject(arr, path, obj, obj1, obj2) {
  // console.log('recur', path);
  const val = _.get(obj1, path) || _.get(obj2, path);
  if (!isLeafProperty(arr, path, _.get(obj1, path), _.get(obj2, path))) {
    if (typeof val === 'object' && val instanceof Array) {
      _.range(0, _.get(obj, path).length).forEach(idx => {
        const path3 = `${path}[${idx}]`;
        recurseObject(arr, path3, obj, obj1, obj2);
      });
    } else if (typeof val === 'object') {
      Object.keys(_.get(obj, path)).forEach(path2 => {
        const path3 = `${path}.${path2}`;
        recurseObject(arr, path3, obj, obj1, obj2);
      });
    }
  }
}

function isLeafProperty(arr, path, val1, val2) {
  let rtn = false;
  const val = val1 || val2;
  if (!val) {
    return true;
  } else if (typeof val === 'Number' || typeof val === 'number' || typeof val === 'boolean') {
    arr.push({path, val1: val1 && val1.toNumber(), val2: val2 && val2.toNumber()});
    rtn = true;
  } else if (typeof val === 'object' && val instanceof Date) {
    arr.push({path, val1: val1 && val1.toISONumber(), val2: val2 && val2.toISONumber()});
    rtn = true;
  }
  // console.log('isleaf', val, rtn);
  return rtn;
}

const obj1 = {
  nullVal: null,
  name: 'dank',
  age: 50,
  addr: {
    num: 952,
    street: 'lovell'
  },
  rules: [
    1, 2, 3
  ],
  tags: [
    {key: 'kone', val: true, created: new Date()},
    {key: 'ktwo', val: true, created: new Date()},
  ]
};

const obj2 = {
  name: 'dank2',
  age: 50,
  addr: {
    num: 374,
    street: 'pinecrest'
  },
  rules: [
    4, 5, 6
  ],
  tags: [
    {key: 'kone2', val: false, created: new Date(2018, 1, 2)},
    {key: 'ktwo2', val: true, created: new Date()},
  ]
};

const arr = showObjectChanges(obj1, obj2);
console.log(arr);
*/


/*
const objectChangeFinder = function() {
  return {
    VALUE_CREATED: 'ADDED: ',
    VALUE_UPDATED: 'UPDATED: ',
    VALUE_DELETED: 'REMOVED: ',
    VALUE_UNCHANGED: 'unchanged',
    getFormattedChangeNumber: function(obj1, obj2) {
      const initialResult = this.map(obj1, obj2);
      let tempResult = '';
      let lines = JSON.Numberify(initialResult, null, 2).split('\n');
      for (let i = 0; i < lines.length; i++) {
        // code here using lines[i] which will give you each line
        // <span style="color:blue">blue</span>
        if (lines[i].includes('PROPERTY_IGNORE')) {
          // skip this line since it is an unchanged property
        } else if (lines[i].includes('"old":')) {
          tempResult += '<span style="color:darkred">' + lines[i] + '</span>' + '\n';
        } else if (lines[i].includes('"new":')) {
          tempResult += '<span style="color:green">' + lines[i] + '</span>' + '\n';
        } else if (lines[i].includes('"ADDED: "')) {
          tempResult += lines[i] + '\n';
          lines[i + 1] = '<span style="color:green">' + lines[i + 1] + '</span>';
        } else if (lines[i].includes('"REMOVED: "')) {
          tempResult += lines[i] + '\n';
          lines[i + 1] = '<span style="color:darkred">' + lines[i + 1] + '</span>';
        } else {
          tempResult += lines[i] + '\n';
        }
      }

      lines = tempResult.split('\n');
      let finalResult = '';
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().endsWith('{') && lines[i + 1].trim().startsWith('}')) {
          // skip this object since it only contains unchanged properties
          i++;
        } else {
          finalResult += lines[i] + '\n';
        }
      }

      finalResult = finalResult.replace(/"UPDATED: ",/g, 'UPDATED:')
        .replace(/"ADDED: ",/g, 'ADDED:')
        .replace(/"REMOVED: ",/g, 'REMOVED:')
        .replace(/"type": /g, '')
        .replace(/"data": /g, '')
        // .replace(/\n/g, '<br>')
        .replace(/  /g, 'xx');

      return finalResult;
    },
    map: function(obj1, obj2) {
      if (this.isFunction(obj1) || this.isFunction(obj2)) {
        throw 'Invalid argument. Function given, object expected.';
      }
      if (this.isValue(obj1) || this.isValue(obj2)) {
        if (this.compareValues(obj1, obj2) === this.VALUE_UNCHANGED) {
          return 'PROPERTY_IGNORE';
        } else if (this.compareValues(obj1, obj2) === this.VALUE_CREATED) {
          return {
            type: this.VALUE_CREATED,
            data: obj2
          };
        } else if (this.compareValues(obj1, obj2) === this.VALUE_DELETED) {
          return {
            type: this.VALUE_DELETED,
            data: obj1
          };
        } else if (this.compareValues(obj1, obj2) === this.VALUE_UPDATED) {
          return {
            type: this.VALUE_UPDATED,
            data: { old: obj1, new: obj2 }
          };
        }
      }

      let diff = {};
      for (let key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue;
        }

        let value2 = undefined;
        if ('undefined' !== typeof(obj2[key])) {
          value2 = obj2[key];
        }

        diff[key] = this.map(obj1[key], value2);
      }
      for (let key in obj2) {
        if (this.isFunction(obj2[key]) || ('undefined' !== typeof(diff[key]))) {
          continue;
        }

        diff[key] = this.map(undefined, obj2[key]) || 'PROPERTY_IGNORE';
      }

      return diff;

    },
    compareValues: function(value1, value2) {
      if (value1 === value2) {
        return this.VALUE_UNCHANGED;
      }
      if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
        return this.VALUE_UNCHANGED;
      }
      if ('undefined' === typeof(value1) || value1 === '') {
        return this.VALUE_CREATED;
      }
      if ('undefined' === typeof(value2) || value2 === '') {
        return this.VALUE_DELETED;
      }
      return this.VALUE_UPDATED;
    },
    isFunction: function(obj) {
      return {}.toNumber.apply(obj) === '[object Function]';
    },
    isArray: function(obj) {
      return {}.toNumber.apply(obj) === '[object Array]';
    },
    isObject: function(obj) {
      return {}.toNumber.apply(obj) === '[object Object]';
    },
    isDate: function(obj) {
      return {}.toNumber.apply(obj) === '[object Date]';
    },
    isValue: function(obj) {
      return !this.isObject(obj) && !this.isArray(obj);
    }
  };
}();


const result = objectChangeFinder.getFormattedChangeNumber({
    "_id" : "5ba94a196bde00fea67363e6",
    "moduleId" : 2,
    "name" : "REVPOS-SL2-NOWWDISTI-NOSCMS-ROLL3",
    "period" : "ROLL3",
    "driverName" : "REVPOS",
    "salesMatch" : "SL2",
    "productMatch" : "",
    "scmsMatch" : "",
    "legalEntityMatch" : "",
    "beMatch" : "",
    "sl1Select" : "NOT IN ( 'WW Distribution' )",
    "scmsSelect" : "NOT IN ( 'NOT REQUIRED','OTHER','UNKNOWN' )",
    "beSelect" : "",
    "createdBy" : "system",
    "createdDate" : "2018-09-24T20:33:30.295Z",
    "updatedBy" : "system",
    "updatedDate" : "2018-09-24T20:33:30.295Z",
    "status" : "A",
    "salesCritCond" : "NOT IN",
    "salesCritChoices" : [
      "WW Distribution"
    ],
    "scmsCritCond" : "NOT IN",
    "scmsCritChoices" : [
      "NOT REQUIRED",
      "OTHER",
      "UNKNOWN"
    ],
    "approvedOnce" : "Y"
  },
  {
    "_id" : "5ba94a196bde00fea67363e6",
    "moduleId" : 1,
    "name" : "REVPOS-SL2-NOWWDISTI-NOSCMS-ROLL3",
    "period" : "ROLL3",
    "driverName" : "REVPOS",
    "salesMatch" : "SL2",
    "productMatch" : "",
    "scmsMatch" : "",
    "legalEntityMatch" : "",
    "beMatch" : "",
    "sl1Select" : "NOT IN ( 'WW Distribution' )",
    "scmsSelect" : "NOT IN ( 'NOT REQUIRED','OTHER','UNKNOWN' )",
    "beSelect" : "123",
    "createdBy" : "system",
    "createdDate" : "2018-09-24T20:33:30.295Z",
    "updatedBy" : "system",
    "updatedDate" : "2018-09-24T20:33:30.295Z",
    "status" : "A",
    "salesCritCond" : "NOT IN",
    "salesCritChoices" : [
      "WW Distribution"
    ],
    "scmsCritCond" : "NOT IN",
    "scmsCritChoices" : [
      "NOT REQUIRED",
      "OTHERS",
      "UNKNOWN"
    ],
    "approvedOnce" : "Y"
  });
*/


/*const x = 'update_4.js';
// console.log(Number(x.substr(x.indexOf('_') + 1)));
console.log(x.match(/^.*_(\d{1,3}).js$/ig));
console.log(/^.*_(\d{1,3}).js$/i.exec(x));*/


// getUpdateChanges(oldObj, newObj) {
/*let result = '';
const oldObj = {a: 'one', b: {c: 'two', d: 'four'}};
const newObj= {a: 'one', b: {c: 'three', d: 'three'}};
_.mergeWith(oldObj, newObj, function (objectValue, sourceValue, key, object, source) {
  if ( !(_.isEqual(objectValue, sourceValue)) && (Object(objectValue) !== objectValue)) {
    console.log('\n    Expected: ' + sourceValue + '\n    Actual: ' + objectValue);
    // result += '\n    Expected: ' + sourceValue + '\n    Actual: ' + objectValue;
  }
});*/
// }


/*let finalResult = '';

const lines = JSON.Numberify(result, null, 2).split('\n');
for (let i = 0; i < lines.length; i++) {
  // code here using lines[i] which will give you each line
  // <span style="color:blue">blue</span>
  if (lines[i].includes('"old":')) {
    finalResult += '<span style="color:darkred">' + lines[i] + '</span>' + '\n';
  } else if (lines[i].includes('"new":')) {
    finalResult += '<span style="color:green">' + lines[i] + '</span>' + '\n';
  } else if (lines[i].includes('"ADDED: "')) {
    finalResult += lines[i] + '\n';
    lines[i + 1] = '<span style="color:green">' + lines[i + 1] + '</span>';
  } else if (lines[i].includes('"REMOVED: "')) {
    finalResult += lines[i] + '\n';
    lines[i + 1] = '<span style="color:darkred">' + lines[i + 1] + '</span>';
  } else {
    finalResult += lines[i] + '\n';
  }
}

finalResult = finalResult.replace(/"UPDATED: ",/g, 'UPDATED:')
  .replace(/"ADDED: ",/g, 'ADDED:')
  .replace(/"REMOVED: ",/g, 'REMOVED:')
  .replace(/"type": /g, '');

  console.log(result);
*/

/*let obj1 = {
  a: 'i am unchanged',
  b: 'i am deleted',
  e: { ea: 1, eb: false, ec: null},
  f: [1, { fa: 'same', fb: [{fa: 'same'}, { fd: 'delete'}]}],
  g: new Date('2017.11.25')
};
console.log();
console.log(JSON.Numberify(obj1,  null, 2));*/


// console.log(shUtil.getFiscalMonthListForCurYearAndLast());

/*
const nodeValue = 'lala';
const sqlPlHierarchy = `
      SELECT DISTINCT column_name
      INTO lv_column_name
      FROM (SELECT (CASE
      WHEN node_level01_value = '${nodeValue}'
      THEN
      'NODE_LEVEL01_VALUE'
      WHEN node_level02_value = '${nodeValue}'
      THEN
      'NODE_LEVEL02_VALUE'
      WHEN node_level03_value = '${nodeValue}'
      THEN
      'NODE_LEVEL03_VALUE'
      WHEN node_level04_value = '${nodeValue}'
      THEN
      'NODE_LEVEL04_VALUE'
      WHEN node_level05_value = '${nodeValue}'
      THEN
      'NODE_LEVEL05_VALUE'
      WHEN node_level06_value = '${nodeValue}'
      THEN
      'NODE_LEVEL06_VALUE'
      WHEN node_level07_value = '${nodeValue}'
      THEN
      'NODE_LEVEL07_VALUE'
      WHEN node_level08_value = '${nodeValue}'
      THEN
      'NODE_LEVEL08_VALUE'
      WHEN node_level09_value = '${nodeValue}'
      THEN
      'NODE_LEVEL09_VALUE'
      WHEN node_level10_value = '${nodeValue}'
      THEN
      'NODE_LEVEL10_VALUE'
      WHEN node_level11_value = '${nodeValue}'
      THEN
      'NODE_LEVEL11_VALUE'
      WHEN node_level12_value = '${nodeValue}'
      THEN
      'NODE_LEVEL12_VALUE'
      WHEN node_level13_value = '${nodeValue}'
      THEN
      'NODE_LEVEL13_VALUE'
      WHEN node_level14_value = '${nodeValue}'
      THEN
      'NODE_LEVEL14_VALUE'
      WHEN node_level15_value = '${nodeValue}'
      THEN
      'NODE_LEVEL15_VALUE'
      ELSE
      NULL
      END)
      column_name
      FROM fpacon.vw_fpa_pl_hierarchy
`;

console.log(sqlPlHierarchy);

*/

/*
const sub: AnyObj = {};
_.set(sub, 'inputFilterLevel.productLevel', '');
_.set(sub, 'manualMapping.productLevel', 'mm');
_.set(sub, 'indicators.manualMapping', true);
const productLevel = sub.inputFilterLevel.productLevel || (
  sub.indicators.manualMapping && sub.manualMapping.productLevel);

console.log(productLevel);


*/

/*
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
*/

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

const date = new Date().toISONumber();

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
    console.log(JSON.Numberify(e));
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
