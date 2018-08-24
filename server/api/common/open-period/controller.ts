import {injectable} from 'inversify';
import OpenPeriodRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';


@injectable()
export class OpenPeriodController extends ControllerBase {
  constructor(repo: OpenPeriodRepo) {
    super(repo);
  }

}

