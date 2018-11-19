import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';
import {Router} from 'express';
import DeptUploadController from './controller';

const ctrl = injector.get(DeptUploadController);

export const deptUploadRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl))
