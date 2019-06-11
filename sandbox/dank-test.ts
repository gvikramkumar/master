import _ from 'lodash';
import AnyObj from '../shared/models/any-obj';
import {shUtil} from '../shared/misc/shared-util';
import {svrUtil} from '../server/lib/common/svr-util';
import Q from 'q';

// import {Subject, BehaviorSubject} from 'rxjs';
// import {take, first} from 'rxjs/operators';



console.log(parseFloat(' 45.1 '));



/*
const err = new Error('bad thing');
err['stuff'] = 'lala';
let obj = {};
Object.keys(err).forEach(key => obj[key] = err[key]);
obj = Object.assign({message: err.message, stack: err.stack}, obj);
console.log(obj);
*/

/*
function throwError() {
  throw new Error('bad');
  return Promise.resolve();
}

throwError()
  .then(() => console.log('success'))
  .catch(err => console.log('failure', err));

*/

/*
console.log(toFixed('xx.123456789', 8));
console.log(toFixed(12, 8));
console.log(toFixed(12., 8));
console.log(toFixed(12.0, 8));
console.log(toFixed(12.1, 8));
console.log(toFixed(0.123456789, 8));
console.log(toFixed(1.123456789, 8));
console.log(toFixed(12.123456789, 8));
console.log(toFixed(123.123456789, 8));
console.log(toFixed(0.0000000001, 8));
console.log(toFixed(1.000000000009, 8));
console.log(toFixed(.999999999679, 8));
console.log(toFixed(0.0000041, 8));
console.log(toFixed(0.00000412, 8));
console.log(toFixed(0.000004123, 8));
console.log(toFixed(0.00000001, 8));
console.log(toFixed(0.00000009, 8));

function toFixed(val, places) {
  return Number(Number(val).toFixed(places));
}

*/


/*
//timeout:
Q.when({name: 'dank'})
  .delay(1000)
  .timeout(900, 'finTimeout')
  .then(val => console.log(val))
  .catch(err => console.error(err));
*/



/*
let a = .123456789123;
// const a = 0.1234567;
// const a = 0.0;
console.log(a);
console.log(truncate8(a));

function truncate8(val) {
 const str = val.toString();
 const dot = str.indexOf('.');
 if (dot !== -1) {
   return Number(str.substring(0, dot) + str.substr(dot, 9));
 } else {
   return val;
 }
}
*/


/*
const a: any = new Date();
const b: any = new Date();
b.setMinutes(b.getMinutes() - 1);
console.log((a - b));
*/


/*
const a = 0.9999999999991583;
console.log(a);
console.log('12', Number(a.toPrecision(12)));
console.log('11', Number(a.toPrecision(11)));
console.log('10', Number(a.toPrecision(10)));
console.log('9', Number(a.toPrecision(9)));
console.log('8', Number(a.toPrecision(8)));
console.log('7', Number(a.toPrecision(7)));
console.log('6', Number(a.toPrecision(6)));
console.log('5', Number(a.toPrecision(5)));
*/

/*
const arr = [
  0.0024022000,  0.0093432000,  0.0104058000,  0.0082426000,  0.0045702000,  0.0011369000,  0.0006224000,  0.0005272000,  0.0004382000,  0.0000836000,  0.0000095000,  0.0000034000,  0.0290631000,  0.0160022000,  0.0042334000,  0.0010619000,  0.0153562000,  0.0108305000,  0.0057088000,  0.0031078000,  0.0015578000,  0.0005411000,  0.0003711000,  0.0000282000,  0.0000269000,  0.0000021000,  0.0000013000,  0.1531303000,  0.0376669000,  0.0253208000,  0.0011853000,  0.0018030000,  0.0044573000,  0.0294652000,  0.0069448000,  0.0003460000,  0.0000041000,  0.0030032000,  0.0010391000,  0.0005069000,  0.0003985000,  0.0008676000,  0.0003185000,  0.0003177000,  0.0000449000,  0.0000370000,  0.0000000000,  0.0228226000,  0.0065168000,  0.0040361000,  0.0002731000,  0.0595648000,  0.0000000000,  0.0027281000,  0.0010180000,  0.0003968000,  0.0002670000,  0.0002451000,  0.0002183000,  0.0000054000,  0.0000552000,  0.0000495000,  0.0000341000,  0.0163510000,  0.0000004000,  0.0000003000,  0.0035644000,  0.0003124000,  0.0001450000,  0.0001430000,  0.0000718000,  0.0000251000,  0.0000227000,  0.0000111000,  0.0000003000,  0.0000001000,  0.0000001000,  0.0000033000,  0.0000028000,  0.0000043000,  0.0000022000,  0.0000053000,  0.0073245000,  0.0117360000,  0.0016360000,  0.0000004000,  0.0000021000,  0.0005736000,  0.0001317000,  0.0001180000,  0.0000232000,  0.0001937000,  0.0000889000,  0.0000023000,  0.0000056000,  0.0000005000,  0.0000004000,  0.0001587000,  0.0001026000,  0.0000661000,  0.0000841000,  0.0000604000,  0.0000000000,  0.0000352000,  0.0006763000,  0.0004115000,  0.0000000000,  0.0001084000,  0.0000806000,  0.0000069000,  0.0000382000,  0.0000227000,  0.0000217000,  0.0004401000,  0.0003229000,  0.0000538000,  0.0000118000,  0.0000095000,  0.0000068000,  0.0000057000,  0.0000051000,  0.0000044000,  0.0000032000,  0.0000007000,  0.0156361000,  0.0080898000,  0.0032458000,  0.0014179000,  0.0000020000,  0.0080462000,  0.0009768000,  0.0000068000,  0.0000062000,  0.0007389000,  0.0000001000,  0.0048859000,  0.0043238000,  0.0000963000,  0.0001804000,  0.0001767000,  0.0001364000,  0.0000006000,  0.0265171000,  0.0101852000,  0.0686938000,  0.0492767000,  0.0233540000,  0.0000523000,  0.0819498000,  0.0222543000,  0.0181878000,  0.0000063000,  0.0017696000,  0.0029048000,  0.0024207000,  0.0021535000,  0.0014357000,  0.0049415000,  0.0000260000,  0.0000182000,  0.0000140000,  0.0000081000,  0.0038648000,  0.0000062000,  0.0193790000,  0.0061973000,  0.0050929000,  0.0034028000,  0.0001157000,  0.0000292000,  0.0212723000,  0.0069258000,  0.0000000000,  0.0000054000,  0.0000013000,  0.0000012000,  0.0000008000,  0.0000001000,  0.0000000000,  0.0064598000,  0.0047745000,  0.0129218000,  0.0094075000,
];
console.log(arr.reduce((p, c) => p + c).toPrecision(12));

const val = 0.9999999999999991;
console.log(val);
console.log(Number(val.toPrecision(12)) === 1.0);
*/


/*
const arr1 = [0.0024022000,  0.0093432000,  0.0104058000,  0.0082426000,];
console.log(arr1.reduce((p, c, i) => {
  console.log(i, p, c, p + c);
  return p + c;
}));

const arr2 = [0.0024022000,  0.0093432000,  0.0104058000,  0.0082426000,  0.0045702000,];
console.log(arr2.reduce((p, c, i) => {
  console.log(i, p, c, p + c);
  return p + c;
}));
*/

/*
console.log(0.0303938, 0.0045702, 0.0303938 + 0.0045702);
console.log(0.0303938, 0.0045702, (0.0303938 + 0.0045702).toPrecision(12));
console.log(303938 + 45702, 'should be:', .034964);
console.log(.1 + .2);
console.log((.1 + .2).toPrecision(12));
*/

/*
const arr = [
  {
    "period" : "MTD"
  },
  {
    "period" : "QTD"
  },
  {
    "period" : "ROLL3"
  },
  {
    "period" : "ROLL6"
  },
  {
    "period" : "PRIOR ROLL3"
  },
  {
    "period" : "PRIOR ROLL6"
  },
  {
    "period" : "PERCENT"
  }
];
console.log(arr.map(v => v.period).sort());
*/


/*
function fiscalYearFromFiscalMonth(fimo) {
  return Number(fimo.toString().substr(0, 4));
}

console.log(fiscalYearFromFiscalMonth(201905));
*/

/*
const users = [
  {name: 'dank', age: 50},
  {name: 'dank', age: 45},
  {name: 'carl', age: 60},
]
console.log(users);
console.log(_.orderBy(users, ['name']));
*/

/*
const arr = [{}, {}]

_.set(arr[0], 'one.two', 'alpha');
_.set(arr[1], 'one.two', 'beta');

const out = _.orderBy(arr, ['one.two'], ['desc']);
console.log(arr);
console.log(out);
*/
/*
import fs from 'fs';
import path from 'path';

const pwd = '/apps/sparkadm/dfa/dfa_ui/dist/server';

console.log(path.resolve(pwd, '../../../../DFA/ssl_cert/dfaSSL.csr'));
*/


/*
function test() {

  return Promise.resolve()
  .then(() => {
    throw new Error('bad');
  })
    .catch(err => {
      const i = 5;
      throw err;
    });

}

function test2() {

    return test()
      .then(() => {
        const i = 5;
      })
      .catch(err => {
        const i = 5;
      });

}

test2();
*/


// clear the object's property if not in list. Uses lodash path for obj and list
/*
function clearPropertyIfNotInList(obj, prop, list, listProp?) {
  if (!obj || !prop || !list) {
    console.error('uiUtil.clearPropertyIfNotInList called with no obj, prop, or list');
    return;
  }
  if (listProp) {
    if (_.findIndex(list, p => _.get(p, listProp) === _.get(obj, prop)) === -1) {
      _.unset(obj, prop);
    }
  } else if (_.indexOf(list, _.get(obj, prop)) === -1) {
    _.unset(obj, prop);
  }
}

const li = ['one', 'two'];
/!*
const li = [
  {indicators: {color: 'one'}},
  {indicators: {color: 'two'}}
];
*!/
const ob = {first: {val: 'One'}};
// clearPropertyIfNotInList(ob, 'first.val', li, 'indicators.color');
clearPropertyIfNotInList(ob, 'first.val', li);
console.log(ob);
*/




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
