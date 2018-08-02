import {Router} from 'express';
import {SourceMappingController} from './controller';
import {injector} from '../../../lib/common/inversify.config';

const ctrl = injector.get(SourceMappingController);

export const sourceMappingRouter = Router()
  .post('/call-method/:method', ctrl.callMethod.bind(ctrl))
  .post('/call-method/:method', ctrl.callMethod.bind(ctrl))
