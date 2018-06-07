const config = require('../server/config/get-config'),
  fs = require('fs'),
  mgConn = require('../server/lib/database/mongoose-conn');

mgConn.promise.then(({db, mongo}) => {
  console.log('loading files...');

  const gfs = new mongo.GridFSBucket(db);
  const dirPath = 'files/business-upload/';
  const meta = {directory: 'prof.bu', buFileType: 'template'};
  const promises = [];
  const buTemplates = [
    {fileName: 'dollar_upload_template.xlsx', buUploadType: 'dollar-upload'},
    {fileName: 'manual_mapping_upload_template.xlsx', buUploadType: 'mapping-upload'},
    {fileName: 'department_upload_template.xlsx', buUploadType: 'dept-upload'},
    {fileName: 'sales_level_split_upload_template.xlsx', buUploadType: 'sales-split-upload'},
    {fileName: 'product_classification_upload_template.xlsx', buUploadType: 'product-class-upload'}
  ]

  buTemplates.forEach(template => {
    const metadata = Object.assign({}, meta);
    const fileName = template.fileName;
    const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    metadata.fileName = fileName;
    metadata.buUploadType = template.buUploadType;
    // console.log(fileName, metadata);
    const promise = new Promise((resolve, reject) => {
      fs.createReadStream(dirPath + fileName).pipe(gfs.openUploadStream(fileName, {metadata, contentType}))
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
