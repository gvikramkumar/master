import MappingUploadController from './controller';
import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import {authorize} from '../../../lib/middleware/authorize';

const ctrl = injector.get(MappingUploadController);

export const mappingUploadRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', authorize('api:admin'), ctrl.remove.bind(ctrl))
