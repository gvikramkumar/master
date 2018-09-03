import {Router} from 'express';
import DatabaseController from './controller';
import {injector} from '../../lib/common/inversify.config';

const ctrl = injector.get(DatabaseController);

export const databaseRouter = Router()
  .post('/mongoToPgSync', ctrl.mongoToPgSync.bind(ctrl))
  .post('/pgToMongoSync', ctrl.pgToMongoSync.bind(ctrl))
