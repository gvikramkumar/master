import {injector} from '../../../lib/common/inversify.config';
import ProcessDateInputController from './controller';
import {Router} from 'express';

const ctrl = injector.get(ProcessDateInputController)

export const lookupRouter = Router()
  .get('/', ctrl.getValues.bind(ctrl))
  .get('/call-method/:method', ctrl.callMethod.bind(ctrl))
  .get('/:key', ctrl.getValue.bind(ctrl))
  .put('/:key', ctrl.upsert.bind(ctrl))
  .delete('/:key', ctrl.remove.bind(ctrl));
