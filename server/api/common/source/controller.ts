import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import SourceRepo from './repo';


@injectable()
export default class SourceController extends ControllerBase {
  constructor(repo: SourceRepo) {
    super(repo);
  }

}

