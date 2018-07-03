import {injector} from '../../../lib/common/inversify.config';
import LookupController from './controller';
import {Router} from 'express';
import {authorize} from '../../../lib/middleware/authorize';


const ctrl = injector.get(LookupController)

export const lookupRouter = Router()
  .post('/', ctrl.add.bind(ctrl))
  .get('/:key', ctrl.getValue.bind(ctrl))
  .put('/:key', ctrl.upsert.bind(ctrl))
  .delete('/:key', ctrl.remove.bind(ctrl));
