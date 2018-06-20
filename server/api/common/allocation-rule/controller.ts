import AllocationRuleRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {injectable} from 'inversify';

@injectable()
export default class AllocationRuleController extends ControllerBase {
  constructor(repo: AllocationRuleRepo) {
    super(repo);
  }

}

