import {injector} from '../../lib/common/inversify.config';
import {Router} from 'express';
import {PgLookupController} from './controller';


const ctrl = injector.get(PgLookupController)

export const pgLookupRouter = Router()
  .post('/call-method/:method', ctrl.callMethod.bind(ctrl))
