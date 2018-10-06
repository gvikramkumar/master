import {Duplex} from 'stream';
import {Buffer} from 'buffer';
import _ from 'lodash';
import {ApiError} from './api-error';
import {DfaModuleIds} from '../../../shared/enums';

export const svrUtil = {
  isLocalEnv,
  getObjectDifferences,
  getItadminEmail,
  getAdminEmail,
  trimStringProperties,
  getMemoryUsage,
  cleanCsv,
  cleanCsvArr,
  objToString,
  convertJsonToCsv,
  getDateRangeFromFiscalYearMo,
  streamToBuffer,
  bufferToStream,
  checkParams,
  setSchemaAdditions,
  sortedListNotExists
};

function isLocalEnv() {
  return !process.env.NODE_ENV || _.includes(['dev', 'ldev', 'unit'], process.env.NODE_ENV);
}

// function getObjectDifferences(oldObj, newObj, delimiter = '\n'): string {
function getObjectDifferences(oldObj, newObj, omitProperties: string[]): string {
  // return `getObjectDifferences ${delimiter} not implemented yet`;
  const objectChangeFinder = function() {
    return {
      VALUE_CREATED: 'ADDED: ',
      VALUE_UPDATED: 'UPDATED: ',
      VALUE_DELETED: 'REMOVED: ',
      VALUE_UNCHANGED: 'unchanged',
      getFormattedChangeString: function(obj1, obj2) {
        const initialResult = this.map(obj1, obj2);
        let tempResult = '';
        let lines = JSON.stringify(initialResult, null, 2).split('\n');
        for (let i = 0; i < lines.length; i++) {
          // code here using lines[i] which will give you each line
          // <span style="color:blue">blue</span>
          if (lines[i].includes('PROPERTY_IGNORE') || lines[i].endsWith('{},')) {
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
          .replace(/\n/g, '<br>')
          .replace(/  /g, '&emsp;&emsp;');

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
        if ('undefined' === typeof(value2) || value2 === null || value2 === '') {
          return this.VALUE_DELETED;
        }
        return this.VALUE_UPDATED;
      },
      isFunction: function(obj) {
        return {}.toString.apply(obj) === '[object Function]';
      },
      isArray: function(obj) {
        return {}.toString.apply(obj) === '[object Array]';
      },
      isObject: function(obj) {
        return {}.toString.apply(obj) === '[object Object]';
      },
      isDate: function(obj) {
        return {}.toString.apply(obj) === '[object Date]';
      },
      isValue: function(obj) {
        return !this.isObject(obj) && !this.isArray(obj);
      }
    };
  }();

  /*console.log('OLDOBJ:' + JSON.stringify(_.omit(_.cloneDeep(oldObj), omitProperties),null,2));
  console.log('NEWOBJ:' + JSON.stringify(_.omit(_.cloneDeep(newObj), omitProperties),null,2));*/

  return objectChangeFinder.getFormattedChangeString
  (_.omit(_.cloneDeep(oldObj), omitProperties), _.omit(_.cloneDeep(newObj), omitProperties));
}

function getItadminEmail(dfa) {
  if (isLocalEnv()) {
    return dfa.user.email;
  }
  return dfa.itAdminEmail;
}

function getAdminEmail(dfa) {
  if (isLocalEnv()) {
    return dfa.user.email;
  }
  return dfa.itAdminEmail; // hack until we get the real module admin email groups
  // return `DFA-${DfaModuleIds[dfa.moduleId].toUpperCase()}-ADMIN@cisco.com`;
}

function sortedListNotExists(values, value) {
  return _.sortedIndexOf(values, value) === -1;
}

function sortedListNotExistsUpper(values, value) {
  if (typeof value === 'string') {
    value = value.toUpperCase();
  }
  return sortedListNotExists(values, value);
}

function trimStringProperties(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim();
    }
  });
}

function getMemoryUsage() {
  const obj = process.memoryUsage();
  return _.forEach(obj, (val, key) => obj[key] = obj[key] / 1000000);
}

// clear out whitespace
function cleanCsv(csv) {
  return csv.split(',').map(x => x.trim()).join(',');
}

// clear out whitespace
function cleanCsvArr(csv) {
  return csv.split(',').map(x => x.trim());
}

function convertJsonToCsv(docs, props) {
  const arrCsv = [];
  docs.forEach(doc => {
    const arrDoc = [];
    props.forEach(prop => {
      arrDoc.push(objToString(doc[prop]));
    });
    arrCsv.push(arrDoc.join(','));
  });
  return arrCsv;
}

function objToString(val) {
  if (typeof val === 'string') {
    return val;
  } else if (_.isNumber(val) || _.isBoolean(val)) {
    return String(val);
  } else if (_.isDate(val)) {
    return val.toISOString();
  } else if (val === null) {
    return '';
  } else if (typeof val === 'object') {// typeof null === 'object' BUT has no toString() method
    return val.toString();
  } else {
    return '';
  }
}

function getDateRangeFromFiscalYearMo(_yearmo) {
  let yearmo = _yearmo;
  if (typeof yearmo === 'number') {
    yearmo = yearmo.toString();
  }
  const year = Number(yearmo.substr(0, 4));
  const month = Number(yearmo.substr(4, 2));


  const startDate = new Date(year, month - 6);
  const endDate = new Date(year, month - 5);

  return {startDate, endDate};
}

function setSchemaAdditions(schema) {
  schema.set('toObject', {
    getters: true,
    transform: (doc, ret, options) => {
      delete ret._id;
      return ret;
    }
  });
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', data => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

function bufferToStream(buffer) {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function checkParams(obj, arrProps, next) {
  const missing = [];
  arrProps.forEach(prop => {
    if (obj[prop] === undefined) {
      missing.push(prop);
    }
  });
  if (missing.length) {
    const err = new ApiError(`Missing parameters: ${missing.join(', ')}`, obj, 400);
    next(err);
    return true;
  }
  return false;
}

