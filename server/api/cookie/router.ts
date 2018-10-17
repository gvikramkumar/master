import {Router} from 'express';
import {injector} from '../../lib/common/inversify.config';
import {authAdmin} from '../../lib/middleware/auth-admin';
import {CookieController} from './controller';

const ctrl = injector.get(CookieController);

export const databaseRouter = Router()
  .put('/', ctrl.setCookie.bind(ctrl))
