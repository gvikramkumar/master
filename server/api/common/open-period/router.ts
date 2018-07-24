import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';
import OpenPeriodPostgresController from './pgcontroller';
import {OpenPeriodController} from './controller';

const ctrl = injector.get(OpenPeriodPostgresController);
// const ctrl = injector.get(OpenPeriodController);

export const openPeriodRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', authorize('api:manage'), ctrl.handlePost.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/', authorize('api:manage'), ctrl.upsert.bind(ctrl))
  .put('/:id', authorize('api:manage'), ctrl.update.bind(ctrl))
  .delete('/', authorize('api:admin'), ctrl.removeOneQuery.bind(ctrl))
  .delete('/:id', authorize('api:admin'), ctrl.remove.bind(ctrl))
