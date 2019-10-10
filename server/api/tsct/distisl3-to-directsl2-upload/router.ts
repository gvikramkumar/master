import Distisl3ToDirectsl2UploadController from './controller';
import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import {authorize} from '../../../lib/middleware/authorize';

const ctrl = injector.get(Distisl3ToDirectsl2UploadController);

export const distisl3ToDistysl2UploadRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl));
