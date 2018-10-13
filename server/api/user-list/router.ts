import {Router} from 'express';
import {UserListController} from './controller';
import {injector} from '../../lib/common/inversify.config';

const ctrl = injector.get(UserListController);

export const UserListRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .get('/query-one', ctrl.getQueryOne.bind(ctrl))
  .post('/query-one', ctrl.upsertQueryOne.bind(ctrl))
