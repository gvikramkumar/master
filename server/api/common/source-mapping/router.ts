import {Router} from 'express';
import SourceMappingController from './controller';
import {injector} from '../../../lib/common/inversify.config';

const ctrl = injector.get(SourceMappingController);

export const sourceMappingRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', ctrl.addOne.bind(ctrl))
  .post('/sync-records', ctrl.syncRecordsQueryOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl))
