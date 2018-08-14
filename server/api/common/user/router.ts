import {Router} from 'express';
import UserController from './controller';
import {injector} from '../../../lib/common/inversify.config';

const ctrl = injector.get(UserController);

export const userRouter = Router()
  .post('/call-method/:method', ctrl.callMethod.bind(ctrl))
