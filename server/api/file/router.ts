import {injector} from '../../lib/common/inversify.config';
import {Router} from 'express';
import FileController from './controller';
import upload from '../../lib/middleware/multer-gridfs';


const ctrl = injector.get(FileController);

export const fileRouter = Router()
  // fileInfo handlers
  .get('/info', ctrl.getInfoMany.bind(ctrl))
  .get('/info/:id', ctrl.getInfoOne.bind(ctrl))

  // file handlers
  .delete('/:id', ctrl.remove.bind(ctrl))
  .get('/:id', ctrl.download.bind(ctrl))
  .post('/', upload.array('fileUploadField'), ctrl.uploadMany.bind(ctrl))
