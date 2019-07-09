import {Router} from 'express';
import DatabaseController from './controller';
import {injector} from '../../lib/common/inversify.config';
import {authAdmin} from '../../lib/middleware/auth-admin';

const ctrl = injector.get(DatabaseController);

export const databaseRouter = Router()
  .get('/pgToMongoSync', authAdmin(), ctrl.pgToMongoSync.bind(ctrl))

