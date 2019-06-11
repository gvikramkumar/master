import {Router} from 'express';
import ModuleController from './controller';
import {injector} from '../../../lib/common/inversify.config';
import {authUnit} from '../../../lib/middleware/auth-unit';

const ctrl = injector.get(ModuleController);

export const moduleRouter = Router()
  .get('/', ctrl.getManyWithRoles.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .post('/call-method/:method', ctrl.callMethod.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/query-one', authUnit(), ctrl.removeQueryOne.bind(ctrl));
