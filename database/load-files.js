const fs = require('fs'),
  mg = require('mongoose');

const args = process.argv;
let uri;
if (args[5] && args[6]) { // user/pass
  uri = `mongodb://${args[5]}:${args[6]}@${args[2]}:${args[3]}/${args[4]}`;
} else {
  uri = `mongodb://${args[2]}:${args[3]}/${args[4]}`;
}

mg.connect(uri, {useNewUrlParser: true})
  .then(() => {
    const mongo = mg.mongo;
    const db = mg.connection.db;

    console.log('loading files...');

    const gfs = new mongo.GridFSBucket(db);
    const dirPath = 'files/prof/business-upload/';
    const meta = {directory: 'prof.bu', buFileType: 'template'};
    const promises = [];
    const buTemplates = [
      {fileName: 'dollar_upload_template.xlsx', buUploadType: 'dollar-upload'},
      {fileName: 'manual_mapping_upload_template.xlsx', buUploadType: 'mapping-upload'},
      {fileName: 'department_upload_template.xlsx', buUploadType: 'dept-upload'},
      {fileName: 'sales_level_split_upload_template.xlsx', buUploadType: 'sales-split-upload'},
      {fileName: 'product_classification_upload_template.xlsx', buUploadType: 'product-class-upload'},
      {fileName: 'alternate_sl2_upload_template.xlsx', buUploadType: 'alternate-sl2-upload'},
      {fileName: 'corp_adjustments_upload_template.xlsx', buUploadType: 'corp-adjustments-upload'},
      {fileName: 'disty_to_direct_upload_template.xlsx', buUploadType: 'disti-direct-upload'},
      {fileName: 'service_map_upload_template.xlsx', buUploadType: 'service-map-upload'},
      {fileName: 'service_training_split_upload_template.xlsx', buUploadType: 'service-training-upload'},
      {fileName: 'misc_exception_mapping.xlsx', buUploadType: 'scms-triangulation-upload'}
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
  .catch(err => {
    console.error(`mongoose connection error: ${uri}`, err);
    return Promise.reject(err);
  });


