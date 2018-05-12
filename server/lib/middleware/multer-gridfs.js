const config = require('../../config/get-config'),
  mg = require('mongoose'),
  multer = require('multer'),
  multerGridFsStorage = require('multer-gridfs-storage')

const gfsStorage = multerGridFsStorage({
  db: mg.connection.db,
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
