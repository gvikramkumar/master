import {Router} from 'express';
import DatabaseController from './controller';
import {injector} from '../../../lib/common/inversify.config';

const ctrl = injector.get(DatabaseController);

export const databaseRouter = Router()
  .post('/mongo-to-pg-sync', ctrl.mongoToPgSync.bind(ctrl))
  .post('/pg-to-mongo-sync', ctrl.pgToMongoSync.bind(ctrl))
