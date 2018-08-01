import {Router} from 'express';
import SourceMappingController from './controller';
import {injector} from '../../../lib/common/inversify.config';

const ctrl = injector.get(SourceMappingController);

export const sourceMappingRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  // .post('/sync-records', ctrl.syncRecords.bind(ctrl))
