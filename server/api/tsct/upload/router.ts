import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import {upload} from '../../../lib/middleware/multer';
import Distisl3ToDirectsl2UploadUploadController from './distisl3-to-directsl2/controller'
const distisl3UploadCtrl = injector.get(Distisl3ToDirectsl2UploadUploadController);
export const profUploadRouter = Router()
  .post('/distisl3-to-directsl2-mapping-upload', upload.single('fileUploadField'), distisl3UploadCtrl.upload.bind(Distisl3ToDirectsl2UploadUploadController));  