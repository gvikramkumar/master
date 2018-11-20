import CorpAdjustmentsUploadController from './controller';
import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import {authorize} from '../../../lib/middleware/authorize';

const ctrl = injector.get(CorpAdjustmentsUploadController);

export const productClassUploadRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl));
