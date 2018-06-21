import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import SubmeasureRepo from './repo';


@injectable()
export default class SubmeasureController extends ControllerBase {
  constructor(repo: SubmeasureRepo) {
    super(repo);
  }
}

