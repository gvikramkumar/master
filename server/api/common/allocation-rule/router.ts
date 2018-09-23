import {Router} from 'express';
import AllocationRuleController from './controller';
import {injector} from '../../../lib/common/inversify.config';
import {authorize} from '../../../lib/middleware/authorize';
import {authAdmin} from '../../../lib/middleware/auth-admin';

const ctrl = injector.get(AllocationRuleController)

export const allocationRuleRouter = Router()
  .get('/', ctrl.getMany.bind(ctrl))
  .post('/', authAdmin(), ctrl.addOne.bind(ctrl))
  .post('/call-method/:method', ctrl.callMethod.bind(ctrl))
  .get('/:id', ctrl.getOne.bind(ctrl))
  .put('/:id', ctrl.update.bind(ctrl))
  .delete('/:id', ctrl.remove.bind(ctrl));

