const config = require('./config/get-config'),
  mg = require('mongoose');

const dbPromise = mg.connect(config.mongoUri)
  .then(() => {
      console.log(`mongoose connected on: ${config.mongoUri}`);
      return {db: mg.connection.db, mongo: mg.mongo};
    },
    err => console.log(`mongoose connection error: ${config.mongoUri}`, err));

module.exports = dbPromise;

