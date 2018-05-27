const config = require('../server/config/get-config'),
  fs = require('fs'),
  mgConn = require('../server/lib/database/mongoose-conn');

mgConn.promise.then(({db, mongo}) => {
  console.log('loading files...');

  const gfs = new mongo.GridFSBucket(db);
  const dirPath = 'files/business-upload/';
  const meta = {directory: 'pft.bu', buFileType: 'template'};
  const promises = [];
  const buTemplates = [
    {fileName: 'dollar-upload.xlsx', buUploadType: 'du'},
    {fileName: 'iaspu-upload.xlsx', buUploadType: 'iaspu'},
    {fileName: 'slspu-upload.xlsx', buUploadType: 'slspu'},
    {fileName: 'mapping-upload.xlsx', buUploadType: 'mm'},
    {fileName: 'pcu-upload.xlsx', buUploadType: 'pcu'}
  ]

  buTemplates.forEach(template => {
    const metadata = Object.assign({}, meta);
    const fileName = template.fileName;
    metadata.fileName = fileName;
    metadata.buUploadType = template.buUploadType;
    // console.log(fileName, metadata);
    const promise = new Promise((resolve, reject) => {
      fs.createReadStream(dirPath + fileName).pipe(gfs.openUploadStream(fileName, {metadata}))
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
    .then(() => {
      console.log('>>>>>>>>> file upload complete');
      process.exit(0);
    })
    .catch(err => console.error('file upload failure:', err));


})
