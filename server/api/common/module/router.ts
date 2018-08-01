import {Router} from 'express';
import ModuleController from './controller';
import {injector} from '../../../lib/common/inversify.config';

const ctrl = injector.get(ModuleController);

export const moduleRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl))
