import SubmeasureController from './controller';
import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';

const ctrl = injector.get(SubmeasureController);

export const submeasureRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .get('/call-method/:method', ctrl.callMethod.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .post('/call-method/:method', ctrl.callMethod.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl))
