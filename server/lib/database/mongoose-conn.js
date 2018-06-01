const config = require('../../config/get-config'),
  mg = require('mongoose');

const options = {
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD
};

const rtn = {};
module.exports = rtn;
rtn.promise = mg.connect(config.mongoUri, options)
  .then(() => {
      console.log(`mongoose connected on: ${config.mongoUri}`);
      mg.connection.on('disconnected', () => console.log('mongoose disconnected'));
      rtn.db = mg.connection.db;
      rtn.mongo = mg.mongo;
      return rtn;
    })
  .catch(err => {
    console.error(`mongoose connection error: ${config.mongoUri}`, err);
    return Promise.reject(err);
  });


