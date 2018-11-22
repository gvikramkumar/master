import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import MeasureController from './controller';
import {authorize} from '../../../lib/middleware/authorize';


const ctrl = injector.get(MeasureController);

export const measureRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl));
