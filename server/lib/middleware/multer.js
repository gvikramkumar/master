const config = require('../../config/get-config').fileUpload,
  multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage()
/*
  limits: {
    fileSize: config.fileSizeMax,
    files: config.fileCountMax
  }
*/
});
module.exports = upload;
