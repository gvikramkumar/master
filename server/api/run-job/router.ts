import {Router} from 'express';
import {injector} from '../../lib/common/inversify.config';
import RunJobController from './controller';

const ctrl = injector.get(RunJobController);

export const runJobRouter = Router()
  .get('/:jobName', ctrl.runJobAndRespond.bind(ctrl))
  .post('/:jobName', ctrl.runJobAndRespond.bind(ctrl));

