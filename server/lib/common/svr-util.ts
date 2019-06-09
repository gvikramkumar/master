import {Duplex} from 'stream';
import {Buffer} from 'buffer';
import _ from 'lodash';
import {ApiError} from './api-error';
import {DfaModuleIds} from '../../../shared/misc/enums';
import config from '../../config/get-config';

export const svrUtil = {
  isLocalEnv,
  isUnitEnv,
  isProdEnv,
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
  sortedListNotExists,
  asciiToBase64,
  base64ToAscii,
  docToObject,
  postgresReplaceQuotes,
  toFixed8,
  toFixed,
  getEnvEmail,
  getErrorForJson,
  docToObjectWithISODate
};

function getErrorForJson(err) {
  const obj = {};
  if (_.isObject(err)) {
    obj['message'] = err.message;
    obj['stack'] = err.stack;
    return obj;
  } else {
    return err;
  }
}
function getEnvEmail(email) {
  if (isLocalEnv()) {
    return getTestEmail();
  }
  return email;
}

function toFixed8(val) {
  return toFixed(val, 8);
}

// round off a number's decimal part to x decimal places, this works with or without numbers before the decimal
function toFixed(val, places) {
  if (val === undefined || val === null) {
    return val;
  } else {
    return Number(Number(val).toFixed(places));
  }
}

// strings are bracketed by single quotes, so we have to escape single quotes within the string
function postgresReplaceQuotes(val) {
  return val.replace(/'/g, '\'\'');
}

function docToObject(doc) {
  if (doc.toObject) {
    return doc.toObject();
  }
  return doc;
}

function asciiToBase64(ascii) {
  return Buffer.from(ascii).toString('base64');
}

function base64ToAscii(base64) {
  return Buffer.from(base64, 'base64').toString('ascii');
}

function isLocalEnv() {
  return _.includes(['dev', 'ldev'], config.env) || isUnitEnv();
}

function isUnitEnv() {
  return _.includes(['unitdev', 'unitsdev', 'unitstage'], config.env);
}

function isProdEnv() {
  return config.env === 'prod';
}

function getTestEmail() {
  return process.env.TEST_EMAIL || 'jodoe@cisco.com';
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

const mongooseSchemaOptions = {
  getters: true,
  transform: (doc, ret, options) => {
    delete ret._id;
    return ret;
  }
};
function setSchemaAdditions(schema) {
  schema.set('toObject', mongooseSchemaOptions);
  schema.set('toJSON', mongooseSchemaOptions);
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const buffers = [];
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

function docToObjectWithISODate(doc) {
  const obj = docToObject(doc);
  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (obj[key] instanceof Date) {
      obj[key] = val.toISOString();
    }
  });
  return obj;
}


// Old function for getting object changes/updates:
/*
function getObjectDifferences(oldObj, newObj, omitProperties: string[]): string {
  let changes = []; // container for changes found in getChanges
  const propertyOf = <TObj>(name: keyof TObj) => name;
  const objectChangeFinder = function() {
    return {
      VALUE_CREATED: 'ADDED: ',
      VALUE_UPDATED: 'UPDATED: ',
      VALUE_DELETED: 'REMOVED: ',
      VALUE_UNCHANGED: 'unchanged',
      getUpdateTable: function(updates) {
        let result = `  <style>
                          table, td, tr {border: 1px solid black;}
                          td {padding-right: 70px;}
                        </style>
                       <table>
                        <tr>
                          <th><b>Property</b></th>
                          <th><b>Old</b></th>
                          <th><b>New</b></th>
                        </tr>`;
        for (let i = 0; i < updates.length; i++) {
          result += `<tr>
                      <td>${updates[i].property}</td>
                      <td>${updates[i].oldVal}</td>
                      <td>${updates[i].newVal}</td>
                     </tr>`;
        }
        result += `</table>`;
        return result;

      },
      getChanges: function(obj1, obj2, propertyName: string) {
        if (this.isFunction(obj1) || this.isFunction(obj2)) {
          throw 'Invalid argument. Function given, object expected.';
        }
        if (this.isValue(obj1) || this.isValue(obj2)) {
          if (this.compareValues(obj1, obj2) === this.VALUE_UNCHANGED) {
            return 'PROPERTY_IGNORE';
          } else if (this.compareValues(obj1, obj2) === this.VALUE_CREATED) {
            changes.push({property: propertyName, oldVal: obj1, newVal: obj2});
            return {
              type: this.VALUE_CREATED,
              data: { oldVal: obj1, newVal: obj2 }
            };
          } else if (this.compareValues(obj1, obj2) === this.VALUE_DELETED) {
            changes.push({property: propertyName, oldVal: obj1, newVal: obj2});
            return {
              type: this.VALUE_DELETED,
              data: { oldVal: obj1, newVal: obj2 }
            };
          } else if (this.compareValues(obj1, obj2) === this.VALUE_UPDATED) {
            changes.push({property: propertyName, oldVal: obj1, newVal: obj2});
            return {
              type: this.VALUE_UPDATED,
              data: { oldVal: obj1, newVal: obj2 }
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

          let propertyPath;
          if (propertyName === '') {
            propertyPath = key;
          } else {
            propertyPath = propertyName + '.' + key;
          }

          diff[key] = this.getChanges(obj1[key], value2, propertyPath); // pass in key to serve as propertyName
        }
        for (let key in obj2) {
          if (this.isFunction(obj2[key]) || ('undefined' !== typeof(diff[key]))) {
            continue;
          }

          diff[key] = this.getChanges(undefined, obj2[key]) || 'PROPERTY_IGNORE';
        }

        return diff; // returns hierarchical change object, but changes[] now contains flat changes.

      },
      compareValues: function(value1, value2) {
        if (value1 === value2 || (typeof value1 === 'string' && typeof value2 === 'string' && value1.trim() === value2.trim()
          || (value1 === undefined && value2 === null) || (value1 === null && value2 === undefined))) {
          return this.VALUE_UNCHANGED;
        }
        if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
          return this.VALUE_UNCHANGED;
        }
        if ('undefined' === typeof(value1) || value1 === null || value1 === '') {
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

  objectChangeFinder.getChanges(_.omit(_.cloneDeep(oldObj), omitProperties), _.omit(_.cloneDeep(newObj), omitProperties), '');
  return objectChangeFinder.getUpdateTable(changes);
}*/

