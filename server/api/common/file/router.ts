import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import FileController from './controller';
import upload from '../../../lib/middleware/multer-gridfs';
import {authorize} from '../../../lib/middleware/authorize';


const ctrl = injector.get(FileController);

export const fileRouter = Router()
  // fileInfo handlers
  .get('/info', ctrl.getInfoMany.bind(ctrl))
  .get('/info/:id', ctrl.getInfoOne.bind(ctrl))

  // file handlers
  .delete('/:id', authorize('api:manage'), ctrl.remove.bind(ctrl))
  .get('/:id', ctrl.download.bind(ctrl))
  .post('/', authorize('api:manage'), upload.array('fileUploadField'), ctrl.uploadMany.bind(ctrl))
