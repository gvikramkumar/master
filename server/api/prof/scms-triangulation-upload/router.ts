import ScmsTriangulationUploadController from './controller';
import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';

const ctrl = injector.get(ScmsTriangulationUploadController);

export const scmsTriangulationUploadRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl));
