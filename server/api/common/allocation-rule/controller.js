const AllocationRuleRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base');

const repo = new AllocationRuleRepo();

module.exports = class AllocationRuleController extends ControllerBase {
  constructor() {
    super(repo);
  }

}

