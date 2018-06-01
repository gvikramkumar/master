const {Duplex} = require('stream'),
  {Buffer} = require('buffer'),
  _ = require('lodash'),
  ApiError = require('./api-error');

module.exports = {
  objToString,
  convertJsonToCsv,
  getDateRangeFromFiscalYearMo,
  streamToBuffer,
  bufferToStream,
  checkParams,
  setSchemaAdditions
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
  } else if (typeof val === 'object') {
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


  let startDate = new Date(year - 1, month - 1 + 7);
  let endDate = new Date(year - 1, month - 1 + 8);

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
  let stream = new Duplex();
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

