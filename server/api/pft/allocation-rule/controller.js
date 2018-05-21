const AllocationRuleRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base');

const repo = new AllocationRuleRepo();

module.exports = class AllocationRuleController extends ControllerBase {
  constructor() {
    super(repo);
  }

}

