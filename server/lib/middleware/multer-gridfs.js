const config = require('../../config/get-config').fileUpload,
  {db} = require('../database/mongoose-conn'),
  multer = require('multer'),
  multerGridFsStorage = require('multer-gridfs-storage')

const gfsStorage = multerGridFsStorage({
  db,
  file: (req, file) => {
    const metadata = {
      userId: req.user.id,
      fileName: file.originalname
    }
    Object.assign(metadata, req.body || {});
    return {metadata};
  }
});

const upload = multer({
  storage: gfsStorage,
  limits: {
    fileSize: config.fileSizeMax,
    files: config.fileCountMax
  }
});
module.exports = upload;
