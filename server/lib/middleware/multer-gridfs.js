const config = require('../../config/get-config'),
  mg = require('mongoose'),
  dbPromise = require('../../mongoose-conn'),
  multer = require('multer'),
  multerGridFsStorage = require('multer-gridfs-storage')


const storage = multerGridFsStorage({
  db: dbPromise,
  file: (req, file) => {
    const metadata = {
      userId: req.user.userName,
      fileName: file.originalname
    }
    Object.assign(metadata, req.body || {});
    return {metadata};
  }
});
const upload = multer({
  storage, limits: {
    fileSize: config.fileSizeMax,
    files: config.fileCountMax
  }
});
module.exports = upload;
