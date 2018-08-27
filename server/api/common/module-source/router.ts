import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';
import {ModuleSourceController} from './controller';

const ctrl = injector.get(ModuleSourceController);

export const moduleSourceRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .get('/query-one', ctrl.getQueryOne.bind(ctrl))
  .post('/upsert', ctrl.upsert.bind(ctrl))
