import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import {upload} from '../../../lib/middleware/multer';
import Distisl3ToDirectsl2UploadUploadController from './distisl3-to-directsl2/controller'
const distisl3ToDirectsl2UploadUploadController = injector.get(Distisl3ToDirectsl2UploadUploadController);
export const tsctUploadRouter = Router()
  .post('/distisl3-to-directsl2-mapping-upload', upload.single('fileUploadField'), distisl3ToDirectsl2UploadUploadController.upload.bind(distisl3ToDirectsl2UploadUploadController));  