const {Duplex} = require('stream'),
  {Buffer} = require('buffer'),
  ApiError = require('./api-error')

module.exports = {
  getDateRangeFromFiscalYearMo,
  streamToBuffer,
  bufferToStream,
  checkParams,
  setSchemaAdditions
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

