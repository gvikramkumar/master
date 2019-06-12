import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {ModuleSourceController} from './controller';
import {authUnit} from '../../../lib/middleware/auth-unit';

const ctrl = injector.get(ModuleSourceController);

export const moduleSourceRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .get('/query-one', ctrl.getQueryOne.bind(ctrl))
  .post('/upsert', ctrl.upsert.bind(ctrl))
  .delete('/query-one', authUnit(), ctrl.removeQueryOne.bind(ctrl));
