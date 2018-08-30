import {Router} from 'express';
import DatabaseController from './controller';
import {injector} from '../../../lib/common/inversify.config';

const ctrl = injector.get(DatabaseController);

export const databaseRouter = Router()
  .post('/mongo-to-pg-sync', ctrl.mongoToPostgresSync.bind(ctrl))
  .post('/pg-to-mongo-sync', ctrl.postgresToMongoSync.bind(ctrl))
