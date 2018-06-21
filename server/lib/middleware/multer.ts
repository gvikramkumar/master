import _config from '../../config/get-config';
import multer from 'multer';

const config = _config.fileUpload;

export const upload = multer({
  storage: multer.memoryStorage()
  /*
    limits: {
      fileSize: config.fileSizeMax,
      files: config.fileCountMax
    }
  */
});


