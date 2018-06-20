import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import ModuleRepo from './repo';


@injectable()
export default class ModuleController extends ControllerBase {
  constructor(repo: ModuleRepo) {
    super(repo);
  }
}

