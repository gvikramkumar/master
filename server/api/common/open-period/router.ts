import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';
import OpenPeriodPostgresController from './pgcontroller';
import {OpenPeriodController} from './controller';

const ctrl = injector.get(OpenPeriodPostgresController);
// const ctrl = injector.get(OpenPeriodController);

export const openPeriodRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .get('/query-one', ctrl.getQueryOne.bind(ctrl))
  .put('/query-one', authorize('api:manage'), ctrl.upsertQueryOne.bind(ctrl))
  .delete('/query-one', authorize('api:admin'), ctrl.removeQueryOne.bind(ctrl))
