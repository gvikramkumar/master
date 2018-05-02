const {Duplex} = require('stream'),
  {Buffer} = require('buffer');

module.exports = {
  streamToBuffer,
  bufferToStream,
  checkParams
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

function checkParams(obj, arrProps, message) {
  const missing = [];
  arrProps.forEach(prop => {
    if (obj[prop] === undefined) {
      missing.push(prop);
    }
  });
  if (missing.length) {
    return new ApiError(`Missing parameters: ${missing.join(', ')}` , obj, 400);
  }
  return null;
}
