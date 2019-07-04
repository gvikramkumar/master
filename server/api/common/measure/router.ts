import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import MeasureController from './controller';
import {authUnit} from '../../../lib/middleware/auth-unit';


const ctrl = injector.get(MeasureController);

export const measureRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .get('/query-one', ctrl.getQueryOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', authUnit(), ctrl.remove.bind(ctrl));
