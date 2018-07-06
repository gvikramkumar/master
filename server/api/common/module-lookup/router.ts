import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import ModuleLookupController from './controller';


const ctrl = injector.get(ModuleLookupController)

export const moduleLookupRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.add.bind(ctrl))
  .get('/:key', ctrl.getValue.bind(ctrl))
  .put('/:key', ctrl.upsert.bind(ctrl))
  .delete('/:key', ctrl.remove.bind(ctrl));
