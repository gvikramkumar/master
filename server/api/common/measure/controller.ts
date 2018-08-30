import {injectable} from 'inversify';
import MeasureRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {MeasurePgRepo} from './pgrepo';


@injectable()
export default class MeasureController extends ControllerBase {
  constructor(repo: MeasureRepo, pgRepo: MeasurePgRepo) {
    super(repo, pgRepo);
  }

}

