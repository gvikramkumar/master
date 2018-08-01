import {Router} from 'express';
import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';
import OpenPeriodPostgresController from './controller';

const ctrl = injector.get(OpenPeriodPostgresController);
// const ctrl = injector.get(OpenPeriodController);

/*
this is a test case for id based queries and query-one based queries. We'll use id-based for now
but leave the query-one endpoints for reference. Position is important here for these id based ones
to coexist with the query-one endpoints, query-one having to come first
 */
export const openPeriodRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .post('/', authorize('api:manage'), ctrl.addOne.bind(ctrl))
  .post('/upsert', authorize('api:manage'), ctrl.upsert.bind(ctrl))
  .put('/:id', authorize('api:manage'), ctrl.update.bind(ctrl))
  .delete('/:id', authorize('api:admin'), ctrl.remove.bind(ctrl))
