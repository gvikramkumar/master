const config = require('../server/config/get-config'),
  gfs = require('gridfs-stream'),
  mg = require('mongoose'),
  fs = require('fs');

const dbPromise = mg.connect(config.mongoUri)
  .then(() => {
      console.log(`mongoose connected on: ${config.mongoUri}`);
      return mg.connection.db;
    },
    err => console.log(`mongoose connection error: ${config.mongoUri}`, err))
  .then(db => {
    // getfiles, open and stream to mongo, but how to set metadata??, might need to query and update fs.files for that.
    // upload templates into mongo


  })
