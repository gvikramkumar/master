const config = require('../server/config/get-config'),
  mg = require('mongoose'),
  fs = require('fs');

const dbPromise = mg.connect(config.mongoUri)
  .then(() => {
      console.log(`mongoose connected on: ${config.mongoUri}`);
      return {db: mg.connection.db, mongo: mg.mongo};
    },
    err => console.log(`mongoose connection error: ${config.mongoUri}`, err))
  .then({db, mongo} => {
    return new Promise((resolve, reject) => {

      const gfs = new mongo.GridFSBucket(db);

      fs.readdir('/files/business-upload/templates', (err, files) => {
        fs.createReadStream('./meistersinger.mp3').
        pipe(gfs.openUploadStream(file)).
        on('error', function(error) {
          assert.ifError(error);
        }).
        on('finish', function() {
          console.log('done!');
          process.exit(0);
        });

      });



    })



  })
