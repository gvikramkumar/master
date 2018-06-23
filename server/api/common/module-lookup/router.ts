import {injector} from '../../../lib/common/inversify.config';
import {Router} from 'express';
import ModuleLookupController from './controller';


const ctrl = injector.get(ModuleLookupController)

export default Router()
  .get('/:type', ctrl.getValues.bind(ctrl));
