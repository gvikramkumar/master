const mongoose = require('mongoose'),
  multer = require('multer'),
  multerGridFsStorage = require('multer-gridfs-storage');

const storage = multerGridFsStorage({
  db: mongoose.connection.db,
  metadata: (req, file, cb) => {
    cb(null, {
      fileName: file.originalname,
      mimetype: file.mimetype,
      uploadType: req.query.uploadType
    });
  }
});
const upload = multer({storage});
module.exports = upload;
