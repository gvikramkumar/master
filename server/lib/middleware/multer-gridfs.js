const config = require('../../config/get-config'),
  mg = require('mongoose'),
  multer = require('multer'),
  multerGridFsStorage = require('multer-gridfs-storage')


const storage = multerGridFsStorage({
  db: mg.connection.db,
  file: (req, file) => {
    const metadata = {
      userId: req.user.userName,
      fileName: file.originalname
    }
    Object.assign(metadata, req.body || {});
    return {metadata};
  }
});
//todo: test out the file size/count max values
const upload = multer({
  storage, limits: {
    fileSize: config.fileSizeMax,
    files: config.fileCountMax
  }
});
module.exports = upload;
