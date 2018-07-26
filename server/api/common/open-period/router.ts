import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';
import OpenPeriodPostgresController from './pgcontroller';
import {OpenPeriodController} from './controller';

const ctrl = injector.get(OpenPeriodPostgresController);
// const ctrl = injector.get(OpenPeriodController);

/*
this is a test case for id based queries and query-one based queries. We'll use id-based for now
but leave the query-one endpoints for reference. Position is important here for these id based ones
to coexist with the query-one endpoints, query-one having to come first
 */
export const openPeriodRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  // .get('/query-one', ctrl.getQueryOne.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .post('/', authorize('api:manage'), ctrl.handlePost.bind(ctrl))
  .put('/query-one', authorize('api:manage'), ctrl.upsertQueryOne.bind(ctrl))
  .put('/:id', authorize('api:manage'), ctrl.update.bind(ctrl))
  // .delete('/query-one', authorize('api:admin'), ctrl.removeQueryOne.bind(ctrl))
  .delete('/:id', authorize('api:admin'), ctrl.remove.bind(ctrl))
