import {injectable} from 'inversify';
import MeasureRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';


@injectable()
export default class MeasureController extends ControllerBase {
  constructor(repo: MeasureRepo) {
    super(repo);
  }

}

