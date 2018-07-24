import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';
import OpenPeriodPostgresController from './pgcontroller';
import {OpenPeriodController} from './controller';

// const ctrl = injector.get(OpenPeriodPostgresController);
const ctrl = injector.get(OpenPeriodController);

export const openPeriodRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', authorize('api:manage'), ctrl.handlePost.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', authorize('api:manage'), ctrl.handlePut.bind(ctrl))
  .delete('/:id', authorize('api:admin'), ctrl.remove.bind(ctrl))
