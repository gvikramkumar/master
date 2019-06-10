import {Router} from 'express';
import SourceController from './controller';
import {injector} from '../../../lib/common/inversify.config';
import {authUnit} from '../../../lib/middleware/auth-unit';

const ctrl = injector.get(SourceController);

export const sourceRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .get('/query-one', ctrl.getQueryOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/query-one', authUnit(), ctrl.removeQueryOne.bind(ctrl));
