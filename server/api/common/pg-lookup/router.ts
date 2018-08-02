import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import {PostgresLookupController} from './controller';


const ctrl = injector.get(PostgresLookupController)

export const pgLookupRouter = Router()
  .post('/call-method/:method', ctrl.callMethod.bind(ctrl))
