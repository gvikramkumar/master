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
 //   const dirPath = 'files/tsct/business-upload/';
  //  const meta = {directory: 'tsct.bu', buFileType: 'template'};
    const meta = { buFileType: 'template'};
    const promises = [];
    // Please add required files in the below. These will be inserted to fs.files collection
    const buTemplates = [
    /*  {fileName: 'dollar_upload_template.xlsx', buUploadType: 'dollar-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'manual_mapping_upload_template.xlsx', buUploadType: 'mapping-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'department_upload_template.xlsx', buUploadType: 'dept-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'sales_level_split_upload_template.xlsx', buUploadType: 'sales-split-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'product_classification_upload_template.xlsx', buUploadType: 'product-class-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'alternate_sl2_upload_template.xlsx', buUploadType: 'alternate-sl2-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'corp_adjustments_upload_template.xlsx', buUploadType: 'corp-adjustments-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'disty_to_direct_upload_template.xlsx', buUploadType: 'disti-direct-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'service_map_upload_template.xlsx', buUploadType: 'service-map-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'service_training_split_upload_template.xlsx', buUploadType: 'service-training-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'},
      {fileName: 'misc_exception_mapping_template.xlsx', buUploadType: 'misc-exception-upload', directory: 'prof.bu',dirPath : 'files/prof/business-upload/'}, */
      {fileName: 'disti_to_direct_upload_template.xlsx', buUploadType: 'distisl3-to-directsl2-mapping-upload', directory: 'tsct.bu',dirPath : 'files/tsct/business-upload/'}
    ]

    buTemplates.forEach(template => {
      const metadata = Object.assign({}, meta);
      const fileName = template.fileName;
      const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      metadata.fileName = fileName;
      metadata.buUploadType = template.buUploadType;
      metadata.directory=template.directory;
      const dirPath = template.dirPath;
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


