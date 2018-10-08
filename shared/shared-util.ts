
import * as _ from 'lodash';

export const shUtil = {
  showObjectChanges,
  isAdminModuleId,
  stringToArray,
  isManualUploadSource,
  getFiscalMonthListFromDate,
  getFiscalMonthListForCurYearAndLast,
  getHtmlForLargeSingleMessage
};

export interface ObjectDiffVal {
  path: string;
  oldVal: any;
  newVal: any;
}

function showObjectChanges(obj1, obj2) {
  let arr: ObjectDiffVal[] = [];
  const obj = _.merge({}, obj1, obj2);

  Object.keys(obj).forEach(path => {
    recurseObject(arr, path, obj, obj1, obj2);
  });

  arr = arr.filter(x => x.val1 !== x.val2);
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
    arr.push({path, val1: val1 && val1.toString(), val2: val2 && val2.toString()});
    rtn = true;
  } else if (typeof val === 'object' && val instanceof Date) {
    arr.push({path, val1: val1 && val1.toISOString(), val2: val2 && val2.toISOString()});
    rtn = true;
  }
  // console.log('isleaf', val, rtn);
  return rtn;
}


function getHtmlForLargeSingleMessage(msg) {
  return `<div style="text-align: center; margin-top: 200px;"><h1>${msg}</h1></div>`;
}

function isManualUploadSource(sourceId: number) {
  return sourceId === 4;
}

function stringToArray(str) {
  return str && str.trim() ? str.split(',').map(x => x.trim()).filter(x => !!x) : [];
}

function isAdminModuleId(moduleId) {
  return moduleId === 99;
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
    const curYear = curDate.getFullYear();
    const curMonthNum = curDate.getMonth() + 1;
    const curMonthName = getMonthNameFromNum(curMonthNum);
    fisDate.setMonth(fisMonths[i]);
    const fisYear = fisDate.getFullYear();
    const fisMonth = fisDate.getMonth() + 1;
    const fisYearMoStr = '' + fisYear + (fisMonth < 10 ? '0' + fisMonth : fisMonth)
    const fisYearMoNum = Number(fisYearMoStr);
    const yearMoMoYear = `${fisYearMoStr} ${curMonthName} FY${fisYear}`;
    yearmos.push({
      // curYear,
      // curMonthNum,
      // curMonthName,
      // fisYear,
      // fisMonth,
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



