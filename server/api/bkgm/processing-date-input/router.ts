import ProcessDateInputController from './controller';
import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';

const ctrl = injector.get(ProcessDateInputController)

export const processDateRouter = Router()
  .post('/', ctrl.add.bind(ctrl));
