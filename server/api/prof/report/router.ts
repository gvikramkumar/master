import ReportController from './controller';
import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import {authorize} from '../../../lib/middleware/authorize';

const ctrl = injector.get(ReportController);

export const reportRouter = Router()
  .post('/:report', authorize('api:manage'), ctrl.getReport.bind(ctrl));
