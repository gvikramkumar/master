import _config from '../../config/get-config';
import {mgc} from '../database/mongoose-conn';
import multer from 'multer';
import multerGridFsStorage from 'multer-gridfs-storage';

const config = _config.fileUpload;
const promise = mgc.promise
  .then(({db}) => db);

const gfsStorage = multerGridFsStorage({
  db: promise,
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

export default upload;
