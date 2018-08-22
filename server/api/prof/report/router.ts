import ReportController from './controller';
import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import {authorize} from '../../../lib/middleware/authorize';

const ctrl = injector.get(ReportController);

export const reportRouter = Router()
  .post('/call-method/:method', ctrl.callMethod.bind(ctrl))
  .post('/:report', ctrl.getExcelReport.bind(ctrl));

