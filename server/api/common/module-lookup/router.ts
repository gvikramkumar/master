import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import ModuleLookupController from './controller';


const ctrl = injector.get(ModuleLookupController)

export const moduleLookupRouter = Router()
  .post('/', ctrl.add.bind(ctrl))
  .get('/:key', ctrl.getValue.bind(ctrl))
  .put('/:key', ctrl.update.bind(ctrl))
  .delete('/:key', ctrl.remove.bind(ctrl));
