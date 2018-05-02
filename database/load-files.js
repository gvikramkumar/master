const config = require('../server/config/get-config'),
  fs = require('fs'),
  dbPromise = require('../server/mongoose-conn'),
  {clone} = require('lodash');

dbPromise.then(({db, mongo}) => {

  const gfs = new mongo.GridFSBucket(db);
  const dirPath = 'files/business-upload/';
  fs.readdir(dirPath, (err, files) => {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    const meta = {directory: 'pft.bu', buFileType: 'template'};
    const promises = [];
    files.forEach(file => {
      const metadata = clone(meta);
      metadata.buUploadType = file.substring(file.lastIndexOf('-')+1, file.lastIndexOf('.'));
      // console.log(file, metadata);
      const promise = new Promise((resolve, reject) => {
        fs.createReadStream(dirPath + file).pipe(gfs.openUploadStream(file, {metadata}))
          .on('error', function (err) {
            reject(err);
          })
          .on('finish', function () {
          resolve();
        });
      });
      promises.push(promise);
    })
    Promise.all(promises)
      .then(() => console.log('file upload complete'))
      .catch(err => console.error('file upload failure:', err));
  });


})
