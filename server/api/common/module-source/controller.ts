import {injectable} from 'inversify';
import ModuleSourceRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';


@injectable()
export class ModuleSourceController extends ControllerBase {
  constructor(repo: ModuleSourceRepo) {
    super(repo);
  }

}

