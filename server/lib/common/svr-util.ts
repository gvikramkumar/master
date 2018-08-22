import {Duplex} from 'stream';
import {Buffer} from 'buffer';
import _ from 'lodash';
import {ApiError} from './api-error';

export const svrUtil = {
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
  })

}

function getMemoryUsage() {
  const obj = process.memoryUsage();
  return _.forEach(obj, (val, key) => obj[key] = obj[key]/1000000);
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

