const config = require('./config/get-config'),
  mg = require('mongoose');

const options = {
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0
};

const dbPromise = mg.connect(config.mongoUri, options)
  .then(() => {
      console.log(`mongoose connected on: ${config.mongoUri}`);
      mg.connection.on('disconnected', () => console.log('mongoose disconnected'));
    })
  .catch(err => {
    console.error(`mongoose connection error: ${config.mongoUri}`, err);
    return Promise.reject(err);
  });

module.exports = dbPromise;

