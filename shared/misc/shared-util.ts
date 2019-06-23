
import _ from 'lodash';
import moment from 'moment-timezone';
import AnyObj from '../models/any-obj';

const catchDisregardHandler = err => {
  if (err === 'disregard') {
    return;
  }
  return Promise.reject(err);
};

export const shUtil = {
  getUpdateTable,
  getObjectChanges,
  isAdminModuleId,
  isManualUploadSource,
  getFiscalMonthListFromDate,
  getFiscalMonthListForCurYearAndLast,
  getFiscalMonthLongNameFromNumber,
  getCutoffDateStrFromFiscalMonth,
  getHtmlForLargeSingleMessage,
  isDeptUpload,
  isDeptUploadMeasure,
  fiscalYearFromFiscalMonth,
  isManualMix,
  convertToPSTTime,
  findDuplicatesByProperty,
  catchDisregardHandler,
  promiseChain,
  stringToArray,
  arrayFilterUndefinedAndEmptyStrings,
};

function promiseChain(_promise) {
  const promise = (_.isArray(_promise) ? Promise.all(_promise) : _promise) || Promise.resolve();
  return Promise.resolve()
    .then(() => {
      return promise;
    });
}

// filter out any array elements that are undefined, empty strings or strings with just spaces in them
function arrayFilterUndefinedAndEmptyStrings(arr) {
  if (!arr) {
    return arr;
  }
  return arr.map(x => x && x.trim ? x.trim() : x).filter(x => !!x);
}

function stringToArray(str, type?) {
  let arr = str && str.trim && str.trim() ? arrayFilterUndefinedAndEmptyStrings(str.split(',')) : [];
  if (type === 'number') {
    arr = arr.map(x => Number(x));
  }
  return arr;
}

function findDuplicatesByProperty(arr, prop) {
  const obj = {};
  const dups = [];
  arr.forEach(item => {
    if (obj[item[prop]]) {
      dups.push(item[prop]);
    } else {
      obj[item[prop]] = 1;
    }
  });
  return _.uniq(dups);
}

function fiscalYearFromFiscalMonth(fimo) {
  return Number(fimo.toString().substr(0, 4));
}

// std cogs adj and mfg overhead measures (2 & 4) AND sm has EXPSSOT MFGO source (#3)
function isDeptUpload(submeasure) {
  return isDeptUploadMeasure(submeasure) && submeasure.sourceId === 3;
}

// std cogs adj and mfg overhead measures (2 & 4)
function isDeptUploadMeasure(submeasure) {
  return (submeasure.measureId === 2 || submeasure.measureId === 4);
}

export interface ObjectDiffVal {
  path: string;
  oldVal: any;
  newVal: any;
}

function getUpdateTable(updates: ObjectDiffVal[]): string {
  if (!updates.length) {
    return 'No changes';
  }
  let result = `  
      <style>
          table {
            border-collapse: collapse;
          }
          
          th, td {
            padding: 8px;
            padding-right: 150px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
       </style>
                       <table>
                        <tr>
                          <th><b>Property</b></th>
                          <th><b>Old</b></th> 
                          <th><b>New</b></th>
                        </tr>`;
  for (let i = 0; i < updates.length; i++) {
    result += `<tr>
                      <td>${updates[i].path}</td>
                      <td>${updates[i].oldVal}</td> 
                      <td>${updates[i].newVal}</td>
                     </tr>`;
  }
  result += `</table>`;
  return result;
}

function getObjectChanges(_obj1, _obj2, omitProperties: string[] = []): ObjectDiffVal[] {
  let arr: ObjectDiffVal[] = [];
  const obj1 = _.omit(_.cloneDeep(_obj1), omitProperties);
  const obj2 = _.omit(_.cloneDeep(_obj2), omitProperties);
  const obj = _.merge({}, obj1, obj2);

  Object.keys(obj).forEach(path => {
    recurseObject(arr, path, obj, obj1, obj2);
  });

  arr = arr.filter(x => {
    if (typeof x.oldVal === 'string' && typeof x.newVal === 'string') {
      return x.oldVal.trim() !== x.newVal.trim();
    }
    return x.oldVal !== x.newVal;
  });
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
  } else if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
    arr.push({path, oldVal: val1 ? val1.toString() : '', newVal: val2 ? val2.toString() : ''});
    rtn = true;
  } else if (typeof val === 'object' && val instanceof Date) {
    arr.push({path, oldVal: val1 ? val1.toISOString() : '', newVal: val2 ? (val2.toISOString ? val2.toISOString() : val2) : ''});
    rtn = true;
  }
  // console.log('isleaf', val, rtn);
  return rtn;
}

function getHtmlForLargeSingleMessage(msg) {
  return `<div style="text-align: center; margin-top: 200px;"><h2>${msg}</h2></div>`;
}

function isManualUploadSource(sourceId: number) {
  return sourceId === 4; // Manual Upload
}

function isAdminModuleId(moduleId) {
  return moduleId === 99;
}

function getCutoffDateStrFromFiscalMonth(fiscalMonthNum) {
  const year = fiscalMonthNum.toString().substr(0, 4);
  const date = new Date(Number(year), 11);
  const fimos = getFiscalMonthListFromDate(date, 24);
  const fimo = _.find(fimos, {fiscalMonth: fiscalMonthNum});
  if (!fimo) {
    throw new Error(`getCutoffDateStrFromFiscalMonth: fiscalmonth not found for: ${fiscalMonthNum}`);
  }
  return fimo.cutoffDateIsoStr;
}

function getFiscalMonthLongNameFromNumber(fiscalMonthNum) {
  if (!fiscalMonthNum) {
    return null;
  }
  const year = fiscalMonthNum.toString().substr(0, 4);
  const date = new Date(Number(year), 11);
  const fimos = getFiscalMonthListFromDate(date, 12 * 50); // go back 50 years for historical data
  const fimo = _.find(fimos, {fiscalMonth: fiscalMonthNum});
  if (!fimo) {
    throw new Error(`getFiscalMonthLongNameFromNumber: fiscalmonth not found for: ${fiscalMonthNum}`);
  }
  return fimo.fiscalMonthName;
}

function getFiscalMonthListForCurYearAndLast() {
  const list = getFiscalMonthListFromDate(new Date(), 24);
  const years = _.uniq(list.map(x => x.fiscalMonthStr.substr(0, 4))).sort().reverse().slice(0, 2);
  return list.filter(x => _.includes(years, x.fiscalMonthStr.substr(0, 4)));
}

function getFiscalMonthListFromDate(date, numMonths) {
  const yearmos = [];
  const curMonths = _.range(date.getMonth(), date.getMonth() - numMonths);
  const fisMonths = _.range(date.getMonth() + 5, date.getMonth() + 5 - numMonths);

  for (let i = 0; i < numMonths; i++) {
    const curDate = new Date(date.getTime());
    const fisDate = new Date(date.getTime());
    curDate.setMonth(curMonths[i]);
    const cutoffDate = new Date(curDate.getFullYear(), curDate.getMonth());
    cutoffDate.setMonth(cutoffDate.getMonth() + 1);
    const curYear = curDate.getFullYear();
    const curMonthNum = curDate.getMonth() + 1;
    const curMonthName = getMonthNameFromNum(curMonthNum);
    fisDate.setMonth(fisMonths[i]);
    const fisYear = fisDate.getFullYear();
    const fisMonth = fisDate.getMonth() + 1;
    const fisYearMoStr = '' + fisYear + (fisMonth < 10 ? '0' + fisMonth : fisMonth);
    const fisYearMoNum = Number(fisYearMoStr);
    const yearMoMoYear = `${fisYearMoStr} ${curMonthName} FY${fisYear}`;
    yearmos.push({
      // curYear,
      // curMonthNum,
      // curMonthName,
      // fisYear,
      // fisMonth,
      cutoffDate: cutoffDate,
      cutoffDateIsoStr: cutoffDate.toISOString(),
      fiscalMonthStr: fisYearMoStr,
      fiscalMonth: fisYearMoNum,
      fiscalMonthName: yearMoMoYear
    });
  }

  return yearmos;
}

function getMonthNameFromNum(mon) {
  const months = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
  };
  return months[mon.toString()];
}

function isManualMix(submeasure) {
  return submeasure.categoryType === 'Manual Mix';
}

function convertToPSTTime(date) {
  return moment(date).tz('America/Los_Angeles').format('MM/DD/YYYY hh:mm A');
}



