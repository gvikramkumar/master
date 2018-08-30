import {injectable} from 'inversify';
import OpenPeriodRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import OpenPeriodPgRepo from './pgrepo';


@injectable()
export class OpenPeriodController extends ControllerBase {
  constructor(repo: OpenPeriodRepo, pgRepo: OpenPeriodPgRepo) {
    super(repo, pgRepo);
  }

}

