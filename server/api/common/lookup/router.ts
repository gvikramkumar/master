import {injector} from '../../../lib/common/inversify.config';
import LookupController from './controller';
import {Router} from 'express';


const ctrl = injector.get(LookupController)

export default Router()
  .get('/:type', ctrl.getValues.bind(ctrl));
