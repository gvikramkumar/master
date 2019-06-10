import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {OpenPeriodController} from './controller';

const ctrl = injector.get(OpenPeriodController);

export const openPeriodRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .get('/query-one', ctrl.getQueryOne.bind(ctrl))
  .post('/upsert', ctrl.upsert.bind(ctrl));
