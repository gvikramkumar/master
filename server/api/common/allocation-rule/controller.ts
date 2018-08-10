import AllocationRuleRepo from './repo';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {injectable} from 'inversify';
import {AllocationRule} from '../../../../shared/models/allocation-rule';

@injectable()
export default class AllocationRuleController extends ControllerBase {
  constructor(repo: AllocationRuleRepo) {
    super(repo);
  }

/*
  addOne(req, res, next) {
    const rule: AllocationRule = req.body;
    if (rule.salesMatch)
  }

*/
}

